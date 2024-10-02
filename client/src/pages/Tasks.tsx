import { AdjustmentsHorizontalIcon } from "@heroicons/react/16/solid";
import TaskList from "../components/tasks/TaskList";
import DisplayModal from "../components/tasks/DisplayModal";
import { useState } from "react";

type Props = {};

export type DisplayType = "list" | "board";

export default function Tasks({}: Props) {
  const [display, setDisplay] = useState<DisplayType>("list");
  const [isDisplayModal, setIsDisplayModal] = useState<boolean>(false);

  return (
    <div className="h-full">
      <header className="wrapper flex justify-between items-center border-b border-zinc-200">
        <h1 className="page-title">Tasks</h1>
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
          <DisplayModal
            display={display}
            setDisplay={setDisplay}
            isDisplayModal={isDisplayModal}
            setIsDisplayModal={setIsDisplayModal}
          />
        </button>
      </header>
      <TaskList display={display} />
    </div>
  );
}
