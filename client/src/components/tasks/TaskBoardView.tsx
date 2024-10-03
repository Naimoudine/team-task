import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/16/solid";
import { useTaskListStore } from "../../store/taskList-Store";

type Props = {
  setDisplayAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentListId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default function TaskBoardSView({
  setDisplayAddTask,
  setCurrentListId,
}: Props) {
  const taskLists = useTaskListStore((state) => state.taskLists);

  const handleOpenModal = (id: string) => {
    setDisplayAddTask(true);
    setCurrentListId(id);
  };

  return (
    <section className="task-list-card">
      {taskLists.map((list) => (
        <div key={list.id}>
          <header className="flex items-center justify-between">
            <h2 className="mb-2 font-semibold">{list.title}</h2>
            <button className="p-1 rounded-lg hover:bg-gray-200" type="button">
              <EllipsisHorizontalIcon className="size-4 text-zinc-600" />
            </button>
          </header>
          <div className="flex flex-col gap-4">
            {list.tasks.map((task) => (
              <article key={task.id} className="task-card">
                {task.title}
              </article>
            ))}
          </div>
          <button
            className="flex items-center justify-center w-full px-2 py-1 mt-4 border-2 rounded-md opacity-100 border-zinc-200 hover:bg-gray-200"
            type="button"
            onClick={() => handleOpenModal(list.id)}
          >
            <PlusIcon className="size-4 text-zinc-600" />
          </button>
        </div>
      ))}
    </section>
  );
}
