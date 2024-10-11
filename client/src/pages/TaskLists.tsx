import { AdjustmentsHorizontalIcon, PlusIcon } from "@heroicons/react/16/solid";
import TaskSection from "../components/tasks/TaskSection";
import DisplayModal from "../components/tasks/DisplayModal";
import AddTaskListModal from "../components/tasks/AddTaskListModal";
import { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import type { TaskList } from "../components/tasks/TaskSection";
import { getTaskLists } from "../api";

type Props = {};

export type DisplayType = "list" | "board";

export const loader = async () => {
  return getTaskLists();
};

export default function TaskLists({}: Props) {
  const [display, setDisplay] = useState<DisplayType>("list");
  const [isDisplayModal, setIsDisplayModal] = useState<boolean>(false);
  const [displayAddTaskListModal, setDisplayAddTaskListModal] =
    useState<boolean>(false);

  const tasklists = useLoaderData() as TaskList[];

  const revalidator = useRevalidator();

  return (
    <div className="h-full">
      <AddTaskListModal
        displayAddTaskListModal={displayAddTaskListModal}
        setDisplayAddTaskListModal={setDisplayAddTaskListModal}
        revalidator={revalidator}
      />
      <header className="relative flex items-center justify-between border-b wrapper border-zinc-200">
        <h1 className=" page-title">Tasks</h1>
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
      <TaskSection
        display={display}
        taskLists={tasklists}
        revalidator={revalidator}
      />
    </div>
  );
}
