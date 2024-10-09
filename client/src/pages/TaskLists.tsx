import { AdjustmentsHorizontalIcon } from "@heroicons/react/16/solid";
import TaskSection from "../components/tasks/TaskSection";
import DisplayModal from "../components/tasks/DisplayModal";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
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

  const tasklists = useLoaderData() as TaskList[];

  return (
    <div className="h-full">
      <header className="relative flex items-center justify-between border-b wrapper border-zinc-200">
        <h1 className=" page-title">Tasks</h1>
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
        <DisplayModal
          display={display}
          setDisplay={setDisplay}
          isDisplayModal={isDisplayModal}
          setIsDisplayModal={setIsDisplayModal}
        />
      </header>
      <TaskSection display={display} taskLists={tasklists} />
    </div>
  );
}
