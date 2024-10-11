import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/16/solid";
import { displayPriority, TaskList } from "./TaskSection";

type Props = {
  taskLists: TaskList[];
  setDisplayAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentListId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default function TaskBoardSView({
  taskLists,
  setDisplayAddTask,
  setCurrentListId,
}: Props) {
  const handleOpenModal = (id: string) => {
    setDisplayAddTask(true);
    setCurrentListId(id);
  };

  return (
    <section className="flex w-full gap-8 px-4">
      {taskLists.length ? (
        taskLists.map((list) => (
          <div className="task-list-card" key={list._id}>
            <header className="flex items-center justify-between">
              <h2 className="mb-2 font-semibold">{list.title}</h2>
              <button
                className="p-1 rounded-lg hover:bg-gray-200"
                type="button"
              >
                <EllipsisHorizontalIcon className="size-4 text-zinc-600" />
              </button>
            </header>
            <div className="flex flex-col gap-4">
              {list.tasksDetails
                ? [...list.tasksDetails]
                    .sort((a, b) => {
                      return b.priority - a.priority;
                    })
                    .map((task) => (
                      <article key={task._id} className="task-card">
                        <h3>{task.title}</h3>
                        <p className="font-semibold text-zinc-500">
                          {displayPriority(task.priority)}
                        </p>
                      </article>
                    ))
                : null}
            </div>
            <button
              className="flex items-center justify-center w-full px-2 py-1 mt-4 border-2 rounded-md opacity-100 border-zinc-200 hover:bg-gray-200"
              type="button"
              onClick={() => handleOpenModal(list._id!)}
            >
              <PlusIcon className="size-4 text-zinc-600" />
            </button>
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
