import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/16/solid";
import { TaskList } from "./TaskSection";
type Props = {
  taskList: TaskList[];
  setDisplayAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentListId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default function TaskBoardSView({
  taskList,
  setDisplayAddTask,
  setCurrentListId,
}: Props) {
  const handleOpenModal = (id: string) => {
    setDisplayAddTask(true);
    setCurrentListId(id);
  };

  return (
    <section className="task-list-card">
      {taskList.map((list) => (
        <div key={list.id}>
          <header className="flex items-center justify-between">
            <h2 className="font-semibold mb-2">{list.title}</h2>
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
            className="border-2 border-zinc-200 rounded-md mt-4 py-1 px-2 flex items-center justify-center opacity-100 hover:bg-gray-200 w-full"
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
