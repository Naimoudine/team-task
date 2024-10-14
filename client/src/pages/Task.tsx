import { NavLink } from "react-router-dom";
import { TagIcon, SlashIcon } from "@heroicons/react/16/solid";
import { UserPlusIcon } from "@heroicons/react/20/solid";
import { getTaskById } from "../api";
import { useLoaderData } from "react-router-dom";
import { displayPriority } from "../components/tasks/TaskSection";
import type { Task, TaskList } from "../components/tasks/TaskSection";
import { Project } from "./Projects";

type Props = {};

interface LoaderType {
  project: Project;
  taskList: TaskList;
  task: Task;
}

export const loader = async ({ params }: any) => {
  try {
    return getTaskById(params.projectId, params.taskListId, params.taskId);
  } catch (error) {
    throw error;
  }
};

export default function Task({}: Props) {
  const { project, taskList, task } = useLoaderData() as LoaderType;

  return (
    <div className="flex flex-col w-full h-full">
      <header className="flex items-center justify-center py-1 bg-zinc-100">
        <p className="w-full py-1 font-semibold text-center text-zinc-600">
          Task
        </p>
      </header>
      <nav className="w-full px-6 py-4 text-sm font-semibold border-b border-zinc-200">
        <ul className="flex items-center">
          <li>
            <NavLink to="/projects">Projects</NavLink>
          </li>
          <SlashIcon className="size-5" />
          <li>
            <NavLink to={`/projects/${project._id}/taskLists`}>
              {project.title}
            </NavLink>
          </li>
          <SlashIcon className="size-5" />
          <li>
            <NavLink
              className={(isActive) =>
                isActive ? "underline underline-offset-2" : ""
              }
              to={`/projects/${project._id}/taskLists/${taskList._id}/tasks/${task._id}`}
            >
              {task._id}
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="flex flex-grow">
        <div className="w-[80%]">
          <div className="max-w-[800px] mx-auto p-8">
            <h1 className="text-2xl font-semibold">{task?.title}</h1>
            <form className="mt-8">
              <textarea
                className="w-full text-lg resize-none"
                name="description"
                id="description"
                placeholder="Add description..."
              />
            </form>
          </div>
        </div>
        <aside className="border-l border-zinc-200 w-[20%] h-full px-4 py-6 flex flex-col gap-8">
          <button className="task-opt-btn" type="button">
            {task?.priority && displayPriority(task?.priority)}
          </button>
          <button className="task-opt-btn" type="button">
            <TagIcon className="size-4 text-zinc-600" />
            Add label
          </button>
          <button className="task-opt-btn" type="button">
            <UserPlusIcon className="size-4 text-zinc-600" />
            Assign
          </button>
        </aside>
      </main>
    </div>
  );
}
