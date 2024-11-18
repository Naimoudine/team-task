import type React from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import type { Task } from "./TaskSection";
import { createTask } from "../../../api";
import { TaskList } from "./TaskSection";

type Props = {
  displayAddTask: boolean;
  setDisplayAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  currentTaskList: TaskList | null;
  revalidator: any;
};

export default function AddTaskModal({
  displayAddTask,
  setDisplayAddTask,
  currentTaskList,
  revalidator,
}: Props) {
  const handeAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newTaskTitle = formData.get("title");
    const newDescription = formData.get("description");
    const newPriority = formData.get("priority");
    const userId = JSON.parse(localStorage.getItem("userId") as string);
    try {
      if (currentTaskList?._id) {
        const newTask: Task = {
          title: newTaskTitle?.toString() || "",
          description: newDescription?.toString() || "",
          priority:
            newPriority === "low"
              ? 1
              : newPriority === "medium"
              ? 2
              : newPriority === "high"
              ? 3
              : 1,
          labelList: [],
        };

        await createTask(userId, currentTaskList._id, newTask);
        revalidator.revalidate();
      }
    } catch (error) {
      throw new Error("Failed to add task");
    }

    form.reset();
    setDisplayAddTask(!displayAddTask);
  };

  return (
    <div className={displayAddTask ? "modal-component" : "hidden"}>
      <form
        className="relative flex flex-col justify-between bg-white w-[60%] h-fit py-4 px-4 rounded-lg"
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
        <div className="flex items-center justify-between mt-2">
          <div>
            <label
              htmlFor="priority"
              className="flex items-center justify-center gap-2"
            >
              <select
                className="p-1 border rounded-lg border-zinc-400"
                name="priority"
                id="priority"
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </label>
          </div>
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
