import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Home from "./pages/Home.tsx";
import TaskLists, { loader as taskListsLoarder } from "./pages/TaskLists.tsx";
import Task from "./pages/Task.tsx";

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
        path: "/taskLists",
        element: <TaskLists />,
        loader: taskListsLoarder,
      },
      {
        path: "/taskLists/:id",
        children: [
          {
            path: "tasks/:id",
            element: <Task />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
