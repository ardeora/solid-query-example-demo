import { Outlet } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";

// Test API: https://jsonplaceholder.typicode.com/todos/

export const Home = () => {
  return (
    <div class="flex-1 p-12 flex flex-col gap-12 overflow-hidden">
      <div class="text-2xl font-semibold text-gray-600 text-center">
        TanStack Query Playground
      </div>

      <pre class="flex-1 border p-8 rounded-md overflow-y-auto">
        <code></code>
      </pre>
    </div>
  );
};
