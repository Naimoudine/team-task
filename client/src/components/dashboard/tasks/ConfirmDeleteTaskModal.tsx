import React from "react";
import { Task } from "./TaskSection";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { deleteTask } from "../../../api";
import { useNavigate } from "react-router-dom";

type Props = {
  task: Task;
  confirmDeleteTask: boolean;
  setConfirmDeleteTask: React.Dispatch<React.SetStateAction<boolean>>;
  redirect: string;
};

export default function ConfirmDeleteTaskModal({
  task,
  confirmDeleteTask,
  setConfirmDeleteTask,
  redirect,
}: Props) {
  const navigate = useNavigate();
  const handleConfirm = async () => {
    try {
      if (task._id) {
        await deleteTask(task._id);
        setConfirmDeleteTask(false);
        return navigate(redirect);
      }
    } catch (error) {
      throw error;
    }
  };
  return (
    <div
      className={
        confirmDeleteTask
          ? "w-screen h-screen absolute top-0 left-0 bg-black/70 flex pt-64 justify-center z-[1000]"
          : "hidden"
      }
    >
      <section className="relative bg-white rounded-lg h-fit w-[25rem] py-2 px-6">
        <h1 className="text-lg font-medium">
          Delete task {task?._id} - {task?.title}
        </h1>
        <p className="mt-2 text-lg">
          Are you sure you want to delete this task ?
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            className="px-2 py-1 font-medium bg-white border-2 rounded-lg border-zinc-200 hover:bg-zinc-100"
            type="button"
            aria-label="cancel delete"
            onClick={() => setConfirmDeleteTask(!confirmDeleteTask)}
          >
            Cancel
          </button>
          <button
            className="px-2 py-1 text-white bg-red-600 border-2 border-transparent rounded-lg hover:bg-red-600/70"
            type="button"
            aria-label="confirm delete"
            onClick={() => handleConfirm()}
          >
            Remove
          </button>
        </div>
      </section>
    </div>
  );
}
