import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Home, { loader as homeLoader } from "./pages/Home.tsx";
import TaskLists, { loader as taskListsLoarder } from "./pages/TaskLists.tsx";
import Task, { loader as taskLoader } from "./pages/Task.tsx";
import Projects, { loader as projectsLoader } from "./pages/Projects.tsx";
import Register, { action as registerAction } from "./pages/Register.tsx";
import Login, { action as loginAction } from "./pages/Login.tsx";
import { authUser } from "./api.ts";
import Landing from "./pages/Landing.tsx";
import Pricing from "./pages/Pricing.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";

function protectedRoute(routeConfig: any) {
  return {
    ...routeConfig,
    loader: async (args: any) => {
      const isAllowed = await authUser();

      if (!isAllowed) {
        return redirect("/");
      }

      if (routeConfig.loader) {
        return routeConfig.loader(args);
      }

      return null;
    },
  };
}

const router = createBrowserRouter([
  protectedRoute({
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <Home />,
        loader: homeLoader,
      },
      {
        path: "/projects",
        element: <Projects />,
        loader: projectsLoader,
      },
      {
        path: "/projects/:id/taskLists",
        element: <TaskLists />,
        loader: taskListsLoarder,
      },
      {
        path: "projects/:projectId/taskLists/:taskListId/tasks/:taskId",
        element: <Task />,
        loader: taskLoader,
      },
    ],
  }),
  {
    path: "/register",
    element: <Register />,
    action: registerAction,
    errorElement: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
    action: loginAction,
    errorElement: <Login />,
  },
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
