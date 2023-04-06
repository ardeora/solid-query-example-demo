import { A, Outlet, useParams } from "@solidjs/router";
import { createMutation, createQuery } from "@tanstack/solid-query";
import {
  Component,
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
} from "solid-js";
import {
  API_URL,
  IUser,
  IUserDetails,
  convertDateToString,
  sleep,
  statusOptions,
} from "../utils/utils";
import { Select } from "@kobalte/core";
import toast from "solid-toast";

interface SelectableValue {
  label: string;
  value: string;
}

export const Admin = () => {
  const [selectedUser, setSelectedUser] = createSignal<string | undefined>(
    undefined
  );
  const [selectedStatus, setSelectedStatus] = createSignal<string | undefined>(
    undefined
  );

  const usersQuery = createQuery(() => ({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/users`).then((res) =>
        res.json()
      );
      return response as IUser[];
    },
    select(data) {
      return data.map((user) => ({
        value: String(user.id),
        label: `${user.firstName} ${user.lastName}`,
      }));
    },
  }));

  const userDetailsQuery = createQuery(() => ({
    queryKey: ["user_details", selectedUser()],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/user_details/${selectedUser()}`
      ).then((res) => res.json());
      return response as IUserDetails;
    },
    enabled: selectedUser() !== undefined,
  }));

  const updateUserMutation = createMutation(() => ({
    mutationFn: async (val: { id: string; status: string }) => {
      await sleep(1000);
      const response = await fetch(`${API_URL}/users/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(val.id),
          status: val.status,
        }),
      }).then((res) => res.json());
      return response as { message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  }));

  createEffect(() => {
    if (selectedUser() && userDetailsQuery.data) {
      setSelectedStatus(userDetailsQuery.data.status);
    }
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const user = selectedUser();
    const status = selectedStatus();
    if (user && status) {
      updateUserMutation.mutate({ id: user, status });
    }
  };

  return (
    <div class="flex-1 flex items-center pt-20 flex-col gap-8">
      <div class="container bg-white/80 max-w-md h-[580px] border rounded-2xl shadow overflow-hidden flex flex-col">
        <Banner user={selectedUser()} />
        <form
          onSubmit={handleSubmit}
          class="mt-16 px-6 pb-6 text-gray-700 flex-1 flex flex-col gap-4"
        >
          <div class="flex flex-col gap-4 flex-1">
            <div class="flex flex-col">
              <label class="pb-1">Select User</label>
              <SelectComponent
                options={usersQuery.data}
                value={selectedUser()}
                onValueChange={setSelectedUser}
                placeholder="Select a user"
              />
            </div>
            <div class="flex flex-col">
              <label class="pb-1">Select Status</label>
              <SelectComponent
                options={statusOptions}
                value={selectedStatus()}
                onValueChange={setSelectedStatus}
                placeholder="Select a status"
              />
            </div>
          </div>
          <div class="flex justify-end">
            <button
              disabled={!Boolean(selectedUser() && selectedStatus())}
              class="bg-blue-500 px-5 py-2 disabled:opacity-75 text-blue-50 hover:bg-blue-600 shadow-blue-500 rounded-md"
            >
              {updateUserMutation.isPending ? "Saving" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface SelectComponentProps {
  options: SelectableValue[] | undefined;
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const SelectComponent: Component<SelectComponentProps> = (props) => {
  return (
    <Select.Root
      // @ts-ignore
      value={props.value}
      onValueChange={props.onValueChange}
      class="select__root"
      optionValue="value"
      optionTextValue="label"
      options={props.options}
      placeholder={props.placeholder}
      valueComponent={(props) => props.item.rawValue.label}
      itemComponent={(props) => (
        <Select.Item item={props.item} class="select__item">
          <Select.ItemLabel>{props.item.rawValue.label}</Select.ItemLabel>
          <Select.ItemIndicator class="select__item-indicator">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Select.ItemIndicator>
        </Select.Item>
      )}
    >
      <Select.Trigger class="select__trigger" aria-label="Fruit">
        <Select.Value class="select__value" />
        <Select.Icon class="select__icon">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 15L12 20L17 15M7 9L12 4L17 9"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="select__content">
          <Select.Listbox class="select__listbox" />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const Banner: Component<{ user: string | undefined }> = (props) => {
  const userQuery = createQuery(() => ({
    queryKey: ["users", props.user],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/users/${props.user}`).then(
        (res) => res.json()
      );
      return response as IUser;
    },
    enabled: props.user !== undefined,
  }));

  return (
    <section class="relative">
      <div class="relative h-36 bg-gray-200 overflow-hidden">
        <div class="relative w-[120%] h-56 left-1/2 -translate-x-1/2">
          <Show when={userQuery.data}>
            <div class="relative w-[120%] h-56 left-1/2 -translate-x-1/2">
              <img
                class="absolute h-full w-full object-cover opacity-70"
                src={`https://source.boringavatars.com/marble/120/${
                  userQuery.data!.username
                }?colors=541e35,df5d2e,ffb43e,a4c972,6bb38e`}
                alt="User cover"
              />
            </div>
          </Show>
        </div>
      </div>
      <div class="absolute bg-gray-300 h-24 w-24 bottom-[5%] left-1/2 translate-y-1/2 -translate-x-1/2 rounded-full overflow-hidden border-4 shadow-lg border-white">
        <Show when={userQuery.data}>
          <img
            class="absolute h-full w-full object-cover"
            src={`https://source.boringavatars.com/marble/120/${
              userQuery.data!.username
            }?colors=541e35,df5d2e,ffb43e,a4c972,6bb38e`}
            alt="User cover"
          />
          <img
            class="absolute h-full w-full bottom-0 left-1/2 -translate-x-1/2 z-10"
            src={userQuery.data!.avatar}
            alt={`${userQuery.data!.firstName} ${userQuery.data!.lastName}`}
          />
        </Show>
      </div>
    </section>
  );
};
