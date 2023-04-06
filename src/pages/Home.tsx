import { Outlet } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";

export const Home = () => {
  const query = createQuery(() => ({
    queryKey: ["first_query"],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      return response.json();
    },
  }));

  return (
    <div class="flex-1 p-12 flex flex-col gap-12 overflow-hidden">
      <div class="text-2xl font-semibold text-gray-600 text-center">
        TanStack Query Playground
      </div>

      <pre class="flex-1 border p-8 rounded-md overflow-y-auto">
        <code>{JSON.stringify(query.data, null, 2)}</code>
      </pre>
    </div>
  );
};
