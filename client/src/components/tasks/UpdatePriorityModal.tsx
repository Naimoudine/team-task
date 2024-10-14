import React from "react";
import { Task } from "./TaskSection";
import { updateTaskPriority } from "../../api";

type Props = {
  task: Task;
  updatePriority: boolean;
  setUpdatePriority: React.Dispatch<React.SetStateAction<boolean>>;
  revalidator: any;
};

export default function UpdatePriorityModal({
  task,
  updatePriority,
  setUpdatePriority,
  revalidator,
}: Props) {
  const handleUpdatePriority = async (priority: string) => {
    let newPriority = undefined;
    switch (priority) {
      case "low":
        newPriority = 1;
        break;
      case "medium":
        newPriority = 2;
        break;
      case "high":
        newPriority = 3;
    }

    try {
      if (task._id && newPriority) {
        await updateTaskPriority(task._id as string, newPriority);
        revalidator.revalidate();
      }
    } catch (error) {
      throw error;
    }
    setUpdatePriority(!updatePriority);
  };

  return (
    <div className="" onClick={(e) => console.log(e)}>
      <div
        className={
          updatePriority
            ? "flex flex-col p-2 rounded-lg shadow-xl w-[120px] overflow-hidden border-2 border-zinc-200 absolute top-0 -left-32 z-[100] bg-white"
            : "hidden"
        }
        onClick={() => setUpdatePriority(!updatePriority)}
      >
        <button
          className="w-full px-4 rounded-lg hover:bg-zinc-200"
          type="button"
          onClick={(e) => handleUpdatePriority(e.currentTarget.innerText)}
        >
          low
        </button>
        <button
          className="w-full px-4 rounded-lg hover:bg-zinc-200"
          type="button"
          onClick={(e) => handleUpdatePriority(e.currentTarget.innerText)}
        >
          medium
        </button>
        <button
          className="w-full px-4 rounded-lg hover:bg-zinc-200"
          type="button"
          onClick={(e) => handleUpdatePriority(e.currentTarget.innerText)}
        >
          high
        </button>
      </div>
    </div>
  );
}
