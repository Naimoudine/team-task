import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Home from "./pages/Home.tsx";
import TaskLists, { loader as taskListsLoarder } from "./pages/TaskLists.tsx";
import Task, { loader as taskLoader } from "./pages/Task.tsx";
import Projects, { loader as projectsLoader } from "./pages/Projects.tsx";

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
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
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
