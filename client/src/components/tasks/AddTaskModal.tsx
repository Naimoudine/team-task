import type React from "react";
import { v4 as uuid } from "uuid";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { TaskList } from "./TaskSection";

type Props = {
  displayAddTask: boolean;
  setDisplayAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  currentListId: string | undefined;
  taskList: TaskList[];
  setTaskList: React.Dispatch<React.SetStateAction<TaskList[]>>;
};

export default function AddTaskModal({
  displayAddTask,
  setDisplayAddTask,
  currentListId,
  taskList,
  setTaskList,
}: Props) {
  const handeAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newTaskTitle = formData.get("title");

    if (currentListId) {
      setTaskList((oldLists) => {
        const newList = [...oldLists];
        const currentListIndex = newList.findIndex(
          (l) => l.id === currentListId
        );
        if (currentListIndex !== -1) {
          const updateList = { ...newList[currentListIndex] };
          if (newTaskTitle && typeof newTaskTitle === "string") {
            updateList.tasks = [
              ...updateList.tasks,
              {
                id: uuid(),
                title: newTaskTitle,
              },
            ];
          }
          newList[currentListIndex] = updateList;
        }
        return newList;
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
            className="hover:bg-gray-200 rounded-lg"
            type="button"
            aria-label="close modal"
            onClick={() => setDisplayAddTask(false)}
          >
            <XMarkIcon className="size-6 text-zinc-600" />
          </button>
        </div>
        <div className="mt-6">
          <input
            className="text-xl w-full"
            type="text"
            name="title"
            id="title"
            placeholder="Task title"
            autoFocus
            required
          />
          <textarea
            className="resize-none mt-2 w-full"
            name="description"
            id="description"
            placeholder="Add a description..."
          />
        </div>
        <div className="self-end">
          <button
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg w-fit hover:bg-blue-600/70"
            type="submit"
          >
            Create task
          </button>
        </div>
      </form>
    </div>
  );
}
