import { A, Outlet, useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { For, Show, createSignal } from "solid-js";
import { API_URL, IUser, IUserDetails, sleep } from "../utils/utils";

export const UserProfile = () => {
  const params = useParams();

  const userQuery = createQuery(() => ({
    queryKey: ["users", params.id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/users/${params.id}`).then(
        (res) => res.json()
      );
      return response as IUser;
    },
  }));

  const userDetailsQuery = createQuery(() => ({
    queryKey: ["user_details", params.id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/user_details/${params.id}`).then(
        (res) => res.json()
      );
      return response as IUserDetails;
    },
  }));

  return (
    <div class="flex-1">
      <Show when={userQuery.data && userDetailsQuery.data}>
        <section class="relative">
          <div class="relative h-56 overflow-hidden">
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
          <div class="absolute h-56 w-56 bottom-[5%] left-20 translate-y-1/2 rounded-full overflow-hidden border-[12px] shadow-lg border-white">
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
        <section class="">
          <div class="container max-w-5xl mx-auto py-6">
            <div class="ml-28">
              <h1 class="font-bold text-gray-900 text-4xl">
                {userQuery.data!.firstName} {userQuery.data!.lastName}
              </h1>
              <p class="text-gray-500 py-4">
                {userDetailsQuery.data!.description}
              </p>
            </div>
          </div>
        </section>
      </Show>
    </div>
  );
};
