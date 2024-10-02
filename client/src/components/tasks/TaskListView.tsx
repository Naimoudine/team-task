import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/16/solid";
import { TaskList } from "./TaskSection";
import type React from "react";

type Props = {
  taskList: TaskList[];
  setTaskList: React.Dispatch<React.SetStateAction<TaskList[]>>;
};

export default function TaskListView({ taskList, setTaskList }: Props) {
  return (
    <section className="w-full">
      <header className="task-list-header">
        <h2 className="task-status">Status 1</h2>
        <button className="p-1 rounded-lg hover:bg-zinc-100" type="button">
          <PlusIcon className="size-4 text-zinc-600 text-zinc-900" />
        </button>
      </header>
      <ul className="task-list">
        <li className="task">
          <Link to="">task 1</Link>
        </li>
        <li className="task">
          <Link to="">task 2</Link>
        </li>
        <li className="task">
          <Link to="">task 3</Link>
        </li>
      </ul>
    </section>
  );
}
