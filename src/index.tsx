/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Routes, Route } from "@solidjs/router";

import "./index.css";
import { PageLayout } from "./components/PageLayout";
import { Home } from "./pages/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@adeora/solid-query-devtools";
import { Query } from "./pages/Query";
import { UserProfile } from "./components/UserProfile";
import { EmptyProfile } from "./components/EmptyProfile";
import { Admin } from "./pages/Admin";
import { Toaster } from "solid-toast";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?"
  );
}

const App = () => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <SolidQueryDevtools />
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<PageLayout />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="query" element={<Query />}>
              <Route path="/" element={<EmptyProfile />}></Route>
              <Route path="/:id" element={<EmptyProfile />}></Route>
            </Route>
            <Route path="/admin" element={<Admin />}></Route>
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

render(() => <App />, root!);
