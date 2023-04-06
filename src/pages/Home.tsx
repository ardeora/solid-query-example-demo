import { Outlet } from "@solidjs/router";

export const Home = () => {
  return (
    <div class="text-3xl font-bold underline">
      <div>Home</div>
      <Outlet />
    </div>
  );
};
