import { useEffect, useState } from "react";
import {
  NavLink,
  useRevalidator,
  Form,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { TagIcon, SlashIcon } from "@heroicons/react/16/solid";
import { UserPlusIcon } from "@heroicons/react/20/solid";
import {
  getTaskById,
  updateTaskDate,
  updateTaskDescription,
  updateTaskDueDate,
} from "../api";
import { displayPriority } from "../components/dashboard/tasks/TaskSection";
import type { Task, TaskList } from "../components/dashboard/tasks/TaskSection";
import { Project } from "./Projects";
import UpdatePriorityModal from "../components/dashboard/tasks/UpdatePriorityModal";
import LabelModal from "../components/dashboard/tasks/LabelModal";
import UpdateTaskTaskListModal from "../components/dashboard/tasks/UpdateTaskTaskListModal";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import TaskSettingsModal from "../components/dashboard/tasks/TaskSettingsModal";
import ConfirmDeleteTaskModal from "../components/dashboard/tasks/ConfirmDeleteTaskModal";

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

export const action = async ({ request, params }: any) => {
  const formData = await request.formData();
  let description = formData.get("description");

  try {
    await updateTaskDescription(params.taskId, description);
    return redirect(`${window.location.href}`);
  } catch (error) {
    throw error;
  }
};

export default function Task({}: Props) {
  const [updateTaskTaskList, setUpdateTaskTaskList] = useState<boolean>(false);
  const [updatePriority, setUpdatePriority] = useState<boolean>(false);
  const [addLabel, setAddLabel] = useState<boolean>(false);
  const [deleteTask, setDeleTask] = useState<boolean>(false);
  const [confirmDeleteTask, setConfirmDeleteTask] = useState<boolean>(false);
  const { project, taskList, task, taskLists, labels } =
    useLoaderData() as LoaderType;
  const [description, setDescription] = useState<string>(task.description!);
  const [modifyDesc, setModifyDesc] = useState<boolean>(false);
  const currentDate = task.date ? new Date(task?.date) : null;
  const currentDue = task.due ? new Date(task?.due) : null;
  const revalidator = useRevalidator();

  const handleDate = async (date: string) => {
    try {
      if (task._id) {
        await updateTaskDate(task._id, date);
      } else if (task._id && date === "") {
        await updateTaskDate(task._id, null);
      }
      return revalidator.revalidate();
    } catch (error) {
      throw error;
    }
  };

  const handleDue = async (date: string) => {
    try {
      if (task._id) {
        await updateTaskDueDate(task._id, date);
      } else if (task._id && date === "") {
        await updateTaskDueDate(task._id, null);
      }
      return revalidator.revalidate();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <ConfirmDeleteTaskModal
        task={task}
        confirmDeleteTask={confirmDeleteTask}
        setConfirmDeleteTask={setConfirmDeleteTask}
        redirect={`/projects/${project._id}/taskLists/`}
      />
      <header className="flex items-center justify-center py-1 bg-zinc-100">
        <p className="w-full py-1 font-semibold text-center text-zinc-600">
          Task
        </p>
      </header>
      <nav className="flex items-center justify-start w-full gap-6 px-6 py-4 text-sm font-semibold border-b border-zinc-200">
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
        <div className="relative">
          <button
            className="p-1 rounded-lg hover:bg-zinc-100"
            type="button"
            aria-label="open setting"
            onClick={() => setDeleTask(!deleteTask)}
          >
            <EllipsisHorizontalIcon className="size-5" />
          </button>
          <TaskSettingsModal
            deleteTask={deleteTask}
            setDeleteTask={setDeleTask}
            setConfirmDeleteTask={setConfirmDeleteTask}
          />
        </div>
      </nav>
      <main className="flex flex-grow">
        <div className="w-[80%]">
          <div className="max-w-[800px] mx-auto p-8">
            <h1 className="text-2xl font-semibold">{task?.title}</h1>
            <Form method="post" className="mt-8">
              <textarea
                className="w-full text-lg resize-none"
                name="description"
                id="description"
                placeholder="Add description..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setModifyDesc(true);
                }}
              />
              <button
                className={
                  modifyDesc
                    ? "px-4 py-2 font-semibold text-white bg-black rounded-lg hover:bg-black/70"
                    : "hidden"
                }
                type="submit"
              >
                save
              </button>
            </Form>
          </div>
        </div>
        <aside className="border-l border-zinc-200 w-[20%] h-full px-4 py-6 flex flex-col gap-6">
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
          <div className="flex flex-col gap-2 px-4">
            <span className="font-semibold">date :</span>
            <input
              className="w-full"
              type="datetime-local"
              name="date"
              id="date"
              onChange={(e) => handleDate(e.currentTarget.value)}
              defaultValue={
                currentDate
                  ? currentDate?.toISOString().slice(0, 16)
                  : undefined
              }
            />
          </div>
          <div className="flex flex-col gap-2 px-4">
            <span className="font-semibold">due-date :</span>
            <input
              className="w-full"
              type="datetime-local"
              name="due"
              id="due"
              onChange={(e) => handleDue(e.currentTarget.value)}
              defaultValue={
                currentDue ? currentDue?.toISOString().slice(0, 16) : undefined
              }
            />
          </div>
          <article>
            <h3 className="mb-4">Labels :</h3>
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
