import { useState } from "react";
import {
  useLoaderData,
  useLocation,
  useRevalidator,
  NavLink,
} from "react-router-dom";
import { AdjustmentsHorizontalIcon, PlusIcon } from "@heroicons/react/16/solid";
import type { TaskList } from "../components/dashboard/tasks/TaskSection";
import TaskSection from "../components/dashboard/tasks/TaskSection";
import DisplayModal from "../components/dashboard/tasks/DisplayModal";
import AddTaskListModal from "../components/dashboard/tasks/AddTaskListModal";
import { getTaskListsByProjectId } from "../api";
import { Project } from "./Projects";
import { SlashIcon } from "@heroicons/react/24/outline";

type Props = {};

export type DisplayType = "list" | "board";

interface LoaderDataType {
  project: Project;
  taskLists: TaskList[];
}

export const loader = async ({ params }: any) => {
  try {
    return getTaskListsByProjectId(params.id);
  } catch (error) {
    throw error;
  }
};

export default function TaskLists({}: Props) {
  const [display, setDisplay] = useState<DisplayType>("list");
  const [isDisplayModal, setIsDisplayModal] = useState<boolean>(false);
  const [displayAddTaskListModal, setDisplayAddTaskListModal] =
    useState<boolean>(false);

  const { project, taskLists } = useLoaderData() as LoaderDataType;

  const revalidator = useRevalidator();

  const { pathname } = useLocation();

  const projectId = pathname.slice(10, pathname.length - 10);

  return (
    <div className="h-full">
      <AddTaskListModal
        displayAddTaskListModal={displayAddTaskListModal}
        setDisplayAddTaskListModal={setDisplayAddTaskListModal}
        revalidator={revalidator}
        projectId={projectId}
      />
      <header className="relative flex items-center justify-between border-b wrapper border-zinc-200">
        <h1 className="page-title">{project?.title}</h1>
        <div className="flex items-center gap-8">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-200"
            onClick={() => setDisplayAddTaskListModal(!displayAddTaskListModal)}
          >
            <PlusIcon className="size-4 text-zinc-600" />
            <span className="text-sm font-semibold text-zinc-600">
              Create List
            </span>
          </button>
          <button
            className={
              isDisplayModal
                ? "relative flex items-center justify-center gap-2 rounded-lg border border-zinc-400 px-2 py-1 bg-gray-200 hover:bg-gray-200"
                : "relative flex items-center justify-center gap-2 rounded-lg border border-zinc-400 px-2 py-1 hover:bg-gray-200"
            }
            onClick={() => setIsDisplayModal(!isDisplayModal)}
          >
            <AdjustmentsHorizontalIcon className="size-4 text-zinc-800" />
            <span className="text-xs font-semibold text-zinc-800">Display</span>
          </button>
        </div>
        <DisplayModal
          display={display}
          setDisplay={setDisplay}
          isDisplayModal={isDisplayModal}
          setIsDisplayModal={setIsDisplayModal}
        />
      </header>
      <nav className="w-full px-6 py-3.5 text-sm font-semibold border-b border-zinc-200">
        <ul className="flex items-center">
          <li>
            <NavLink to="/projects">Projects</NavLink>
          </li>
          <SlashIcon className="size-5" />
          <li>
            <NavLink
              className={(isActive) =>
                isActive ? "underline underline-offset-2" : ""
              }
              to={`/projects/${projectId}/taskLists`}
            >
              {project.title}
            </NavLink>
          </li>
        </ul>
      </nav>
      <TaskSection
        display={display}
        taskLists={taskLists}
        revalidator={revalidator}
        projectId={projectId}
      />
    </div>
  );
}
