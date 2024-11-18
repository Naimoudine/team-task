import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/16/solid";
import type React from "react";
import { displayPriority, TaskList } from "./TaskSection";
import { TrashIcon } from "@heroicons/react/24/outline";

type Props = {
  taskLists: TaskList[];
  setDisplayAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: string;
  setCurrentTaskList: React.Dispatch<React.SetStateAction<TaskList | null>>;
  setConfirmDeleteTaskList: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TaskListView({
  taskLists,
  setDisplayAddTask,
  projectId,
  setCurrentTaskList,
  setConfirmDeleteTaskList,
}: Props) {
  const handleOpenModal = (taskList: TaskList) => {
    setDisplayAddTask(true);
    setCurrentTaskList(taskList);
  };

  const handleDelete = (taskList: TaskList) => {
    setConfirmDeleteTaskList(true);
    setCurrentTaskList(taskList);
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
              <div>
                <button
                  className="p-1 rounded-lg hover:bg-zinc-100"
                  type="button"
                  onClick={() => handleOpenModal(list!)}
                >
                  <PlusIcon className="size-4 text-zinc-600 text-zinc-900" />
                </button>
                <button
                  className="p-1 rounded-lg hover:bg-zinc-100"
                  type="button"
                  onClick={() => handleDelete(list!)}
                >
                  <TrashIcon className="size-4 text-zinc-600 text-zinc-900 hover:text-red-600" />
                </button>
              </div>
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
                          to={`/projects/${projectId}/taskLists/${list._id}/tasks/${task._id}`}
                        >
                          <div>
                            <span className="mr-4 font-semibold text-zinc-500">
                              {displayPriority(task.priority)}
                            </span>
                            {task.title}
                          </div>
                          <div className="flex gap-2">
                            {task.labelList.map((label) => (
                              <span key={label} className="task-label z-[100]">
                                {label}
                              </span>
                            ))}
                          </div>
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
