import { A, Outlet } from "@solidjs/router";

export const PageLayout = () => {
  return (
    <div class="h-screen flex flex-col">
      <header class="h-12 border-b px-4 flex items-center justify-between">
        <A href="/" class="flex items-center gap-2">
          <img class="h-3" src="/logo-wordmark.svg" alt="Solid Logo" />
          <span class="font-medium text-[#58595B]">+</span>
          <span class="font-bold text-[#58595B]">TANSTACK Query</span>
        </A>
        <nav class="font-medium text-gray-600 flex items-center gap-2">
          <A class="hover:underline" href="/">
            Home
          </A>
          <A class="hover:underline" href="query">
            Query
          </A>
        </nav>
      </header>
      <Outlet />
    </div>
  );
};
