import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/16/solid";
import { displayPriority, TaskList } from "./TaskSection";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";

type Props = {
  taskLists: TaskList[];
  setDisplayAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: string;
  setCurrentTaskList: React.Dispatch<React.SetStateAction<TaskList | null>>;
  setConfirmDeleteTaskList: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TaskBoardSView({
  taskLists,
  setDisplayAddTask,
  projectId,
  setCurrentTaskList,
  setConfirmDeleteTaskList,
}: Props) {
  const navigate = useNavigate();
  const handleOpenModal = (taskList: TaskList) => {
    setDisplayAddTask(true);
    setCurrentTaskList(taskList);
  };

  const handleDelete = (tasklist: TaskList) => {
    setConfirmDeleteTaskList(true);
    setCurrentTaskList(tasklist);
  };

  return (
    <section className="flex w-full gap-8 px-4">
      {taskLists.length ? (
        taskLists.map((list) => (
          <div className="task-list-card" key={list._id}>
            <header className="flex items-center justify-between">
              <h2 className="mb-2 font-semibold">{list.title}</h2>
              <div className="relative">
                <button
                  className="p-1 rounded-lg hover:bg-gray-200"
                  type="button"
                  onClick={() => handleDelete(list!)}
                >
                  <TrashIcon className="size-4 text-zinc-600 hover:text-red-600" />
                </button>
              </div>
            </header>
            <div className="flex flex-col gap-4">
              {list.tasksDetails
                ? [...list.tasksDetails]
                    .sort((a, b) => {
                      return b.priority - a.priority;
                    })
                    .map((task) => (
                      <article
                        key={task._id}
                        className="task-card"
                        onClick={() =>
                          navigate(
                            `/projects/${projectId}/taskLists/${list._id}/tasks/${task._id}`
                          )
                        }
                      >
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-zinc-500">
                            {displayPriority(task.priority)}
                          </p>
                          <h3 className="text-sm font-bold">{task.title}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {task.labelList.map((label) => (
                            <span key={label} className="task-label">
                              {label}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))
                : null}
            </div>
            <button
              className="flex items-center justify-center w-full px-2 py-1 mt-4 border-2 rounded-md opacity-100 border-zinc-200 hover:bg-gray-200"
              type="button"
              onClick={() => handleOpenModal(list!)}
            >
              <PlusIcon className="size-4 text-zinc-600" />
            </button>
          </div>
        ))
      ) : (
        <h2 className="w-full mt-8 font-semibold text-center">
          You don't have lists. Feel free to create one.
        </h2>
      )}
    </section>
  );
}
