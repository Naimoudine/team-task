import type React from "react";
import { v4 as uuid } from "uuid";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { TaskList } from "./TaskSection";
import { useTaskListStore } from "../../store/taskList-Store";

type Props = {
  displayAddTask: boolean;
  setDisplayAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  currentListId: string | undefined;
};

export default function AddTaskModal({
  displayAddTask,
  setDisplayAddTask,
  currentListId,
}: Props) {
  const addTask = useTaskListStore((state) => state.addTask);

  const handeAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newTaskTitle = formData.get("title");

    if (currentListId) {
      addTask(currentListId, {
        id: uuid(),
        title: newTaskTitle?.toString()!,
      });
    }

    form.reset();
    setDisplayAddTask(!displayAddTask);
  };

  return (
    <div
      className={
        displayAddTask
          ? "w-screen h-screen absolute top-0 left-0 bg-black/70 flex pt-48 justify-center z-[100]"
          : "hidden"
      }
    >
      <form
        className="relative flex flex-col justify-between bg-white w-[60%] h-[200px] py-4 px-4 rounded-lg"
        onSubmit={(e) => handeAddTask(e)}
      >
        <div className="flex items-center justify-between">
          <p className="font-semibold">Add a task</p>
          <button
            className="rounded-lg hover:bg-gray-200"
            type="button"
            aria-label="close modal"
            onClick={() => setDisplayAddTask(false)}
          >
            <XMarkIcon className="size-6 text-zinc-600" />
          </button>
        </div>
        <div className="mt-6">
          <input
            className="w-full text-xl"
            type="text"
            name="title"
            id="title"
            placeholder="Task title"
            autoFocus
            required
          />
          <textarea
            className="w-full mt-2 resize-none"
            name="description"
            id="description"
            placeholder="Add a description..."
          />
        </div>
        <div className="self-end">
          <button
            className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg w-fit hover:bg-blue-600/70"
            type="submit"
          >
            Create task
          </button>
        </div>
      </form>
    </div>
  );
}
