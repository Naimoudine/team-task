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
      {taskLists.length ? (
        taskLists?.map((list) => (
          <div key={list._id}>
            <header className="task-list-header">
              <h2 className="task-title">
                {list.title}
                <span className="text-zinc-400">
                  {list.tasksDetails ? list.tasksDetails.length : 0}
                </span>
              </h2>
              <button
                className="p-1 rounded-lg hover:bg-zinc-100"
                type="button"
                onClick={() => handleOpenModal(list._id!)}
              >
                <PlusIcon className="size-4 text-zinc-600 text-zinc-900" />
              </button>
            </header>
            <ul className="task-list">
              {list.tasksDetails
                ? [...list.tasksDetails]
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
                    ))
                : null}
            </ul>
          </div>
        ))
      ) : (
        <h2 className="w-full mt-8 font-semibold text-center">
          You don't have a list. Feel free to create one.
        </h2>
      )}
    </section>
  );
}
