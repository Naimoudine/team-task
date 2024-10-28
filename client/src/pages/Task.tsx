import { NavLink, useRevalidator } from "react-router-dom";
import { TagIcon, SlashIcon } from "@heroicons/react/16/solid";
import { UserPlusIcon } from "@heroicons/react/20/solid";
import { getTaskById, updateTaskPriority } from "../api";
import { useLoaderData } from "react-router-dom";
import { displayPriority } from "../components/dashboard/tasks/TaskSection";
import type { Task, TaskList } from "../components/dashboard/tasks/TaskSection";
import { Project } from "./Projects";
import { useState } from "react";
import UpdatePriorityModal from "../components/dashboard/tasks/UpdatePriorityModal";
import LabelModal from "../components/dashboard/tasks/LabelModal";
import UpdateTaskTaskListModal from "../components/dashboard/tasks/UpdateTaskTaskListModal";

type Props = {};

export interface Label {
  label: string;
}

interface LoaderType {
  project: Project;
  taskList: TaskList;
  task: Task;
  taskLists: TaskList[];
  labels: Label[];
}

export const loader = async ({ params }: any) => {
  try {
    return getTaskById(params.projectId, params.taskListId, params.taskId);
  } catch (error) {
    throw error;
  }
};

export default function Task({}: Props) {
  const [updateTaskTaskList, setUpdateTaskTaskList] = useState<boolean>(false);
  const [updatePriority, setUpdatePriority] = useState<boolean>(false);
  const [addLabel, setAddLabel] = useState<boolean>(false);
  const { project, taskList, task, taskLists, labels } =
    useLoaderData() as LoaderType;
  const revalidator = useRevalidator();

  return (
    <div className="flex flex-col w-full h-full">
      <header className="flex items-center justify-center py-1 bg-zinc-100">
        <p className="w-full py-1 font-semibold text-center text-zinc-600">
          Task
        </p>
      </header>
      <nav className="w-full px-6 py-4 text-sm font-semibold border-b border-zinc-200">
        <ul className="flex items-center">
          <li>
            <NavLink to="/projects">Projects</NavLink>
          </li>
          <SlashIcon className="size-5" />
          <li>
            <NavLink to={`/projects/${project._id}/taskLists`}>
              {project.title}
            </NavLink>
          </li>
          <SlashIcon className="size-5" />
          <li>
            <NavLink
              className={(isActive) =>
                isActive ? "underline underline-offset-2" : ""
              }
              to={`/projects/${project._id}/taskLists/${taskList._id}/tasks/${task._id}`}
            >
              {task._id}
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="flex flex-grow">
        <div className="w-[80%]">
          <div className="max-w-[800px] mx-auto p-8">
            <h1 className="text-2xl font-semibold">{task?.title}</h1>
            <form className="mt-8">
              <textarea
                className="w-full text-lg resize-none"
                name="description"
                id="description"
                placeholder="Add description..."
              />
            </form>
          </div>
        </div>
        <aside className="border-l border-zinc-200 w-[20%] h-full px-4 py-6 flex flex-col gap-8">
          <div className="relative">
            <button
              className={
                updateTaskTaskList ? "task-opt-btn bg-zinc-200" : "task-opt-btn"
              }
              type="button"
              onClick={() => setUpdateTaskTaskList(!updateTaskTaskList)}
            >
              {taskList.title}
            </button>
            <UpdateTaskTaskListModal
              project={project}
              task={task}
              taskLists={taskLists}
              updateTaskTaskList={updateTaskTaskList}
              setUpdateTaskTaskList={setUpdateTaskTaskList}
              revalidator={revalidator}
            />
          </div>
          <div className="relative">
            <button
              className={
                updatePriority ? "task-opt-btn bg-zinc-200" : "task-opt-btn"
              }
              type="button"
              onClick={() => setUpdatePriority(!updatePriority)}
            >
              {task?.priority && displayPriority(task?.priority)}
            </button>
            <UpdatePriorityModal
              task={task}
              setUpdatePriority={setUpdatePriority}
              updatePriority={updatePriority}
              revalidator={revalidator}
            />
          </div>
          <div className="relative">
            <button
              className={addLabel ? "task-opt-btn bg-zinc-200" : "task-opt-btn"}
              type="button"
              onClick={() => setAddLabel(!addLabel)}
            >
              <TagIcon className="size-4 text-zinc-600" />
              Add label
            </button>
            <LabelModal
              task={task}
              labels={labels}
              addLabel={addLabel}
              setAddLabel={setAddLabel}
              revalidator={revalidator}
            />
          </div>
          <button className="task-opt-btn" type="button">
            <UserPlusIcon className="size-4 text-zinc-600" />
            Assign
          </button>
          <article>
            <h3 className="mb-4">Labels</h3>
            <div className="flex flex-wrap gap-4">
              {task.labelList.map((label) => (
                <span className="task-label" key={label}>
                  {label}
                </span>
              ))}
            </div>
          </article>
        </aside>
      </main>
    </div>
  );
}
