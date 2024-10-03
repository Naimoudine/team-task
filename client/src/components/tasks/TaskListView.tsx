import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/16/solid";
import type React from "react";
import { useTaskListStore } from "../../store/taskList-Store";
import { displayPriority } from "./TaskSection";

type Props = {
  setDisplayAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentListId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default function TaskListView({
  setDisplayAddTask,
  setCurrentListId,
}: Props) {
  const taskLists = useTaskListStore((state) => state.taskLists);

  const handleOpenModal = (id: string) => {
    setDisplayAddTask(true);
    setCurrentListId(id);
  };

  return (
    <section className="w-full">
      {taskLists.map((list) => (
        <div key={list.id}>
          <header className="task-list-header">
            <h2 className="task-status">{list.title}</h2>
            <button
              className="p-1 rounded-lg hover:bg-zinc-100"
              type="button"
              onClick={() => handleOpenModal(list.id)}
            >
              <PlusIcon className="size-4 text-zinc-600 text-zinc-900" />
            </button>
          </header>
          <ul className="task-list">
            {[...list.tasks]
              .sort((a, b) => {
                return b.priority - a.priority;
              })
              .map((task) => (
                <li key={task.id} className="task">
                  <Link to={`/tasks/${task.id}`}>
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
