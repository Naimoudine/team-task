import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/16/solid";
import { TaskList } from "./TaskSection";
type Props = {
  taskList: TaskList[];
  setTaskList: React.Dispatch<React.SetStateAction<TaskList[]>>;
};

export default function TaskBoardSView({ taskList, setTaskList }: Props) {
  return (
    <section className="task-list-card">
      <header className="flex items-center justify-between">
        <h2 className="font-semibold mb-2">Status 1</h2>
        <button className="p-1 rounded-lg hover:bg-gray-200" type="button">
          <EllipsisHorizontalIcon className="size-4 text-zinc-600" />
        </button>
      </header>
      <article className="task-card">task 1</article>
      <article className="task-card">task 2</article>
      <article className="task-card">task 3</article>
      <article className="task-card">task 4</article>
      <button
        className="border-2 border-zinc-200 rounded-md py-1 px-2 flex items-center justify-center opacity-100 mt-2 hover:bg-gray-200"
        type="button"
      >
        <PlusIcon className="size-4 text-zinc-600" />
      </button>
    </section>
  );
}
