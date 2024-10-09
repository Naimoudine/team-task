import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/16/solid";
import type React from "react";
import { displayPriority, TaskList } from "./TaskSection";

type Props = {
  taskLists: TaskList[];
  setDisplayAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentListId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default function TaskListView({
  taskLists,
  setDisplayAddTask,
  setCurrentListId,
}: Props) {
  const handleOpenModal = (id: string) => {
    setDisplayAddTask(true);
    setCurrentListId(id);
  };

  return (
    <section className="w-full">
      {taskLists?.map((list) => (
        <div key={list._id}>
          <header className="task-list-header">
            <h2 className="task-status">{list.title}</h2>
            <button
              className="p-1 rounded-lg hover:bg-zinc-100"
              type="button"
              onClick={() => handleOpenModal(list._id)}
            >
              <PlusIcon className="size-4 text-zinc-600 text-zinc-900" />
            </button>
          </header>
          <ul className="task-list">
            {[...list.tasksDetails]
              .sort((a, b) => {
                return b.priority - a.priority;
              })
              .map((task) => (
                <li key={task._id} className="flex">
                  <Link
                    className="w-full task"
                    to={`/taskLists/${list._id}/tasks/${task._id}`}
                  >
                    <span className="mr-4 font-semibold text-zinc-500">
                      {displayPriority(task.priority)}
                    </span>
                    {task.title}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
