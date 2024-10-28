import { useState } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router-dom";
import { FolderIcon } from "@heroicons/react/16/solid";
import {
  PlusIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { getProjects } from "../api";
import DisplayModal from "../components/dashboard/tasks/DisplayModal";
import { DisplayType } from "./TaskLists";
import AddProjectModal from "../components/dashboard/projects/AddProjectModal";

type Props = {};

export interface Project {
  _id?: string;
  title: string;
  taskLists: string[];
}

export const loader = async () => {
  try {
    const projects = await getProjects();
    return projects;
  } catch (error) {
    throw error;
  }
};

export default function Projects({}: Props) {
  const [displayAddProjectModal, setDisplayAddProjectModal] =
    useState<boolean>(false);
  const revalidator = useRevalidator();
  const projects = useLoaderData() as Project[];

  return (
    <div className="h-full">
      <AddProjectModal
        displayAddProjectModal={displayAddProjectModal}
        setDisplayAddProjectModal={setDisplayAddProjectModal}
        revalidator={revalidator}
      />
      <header className="page-header">
        <h1 className="page-title">Projects</h1>
        <div className="flex items-center gap-8">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-200"
            onClick={() => setDisplayAddProjectModal(!displayAddProjectModal)}
          >
            <PlusIcon className="size-4 text-zinc-600" />
            <span className="text-sm font-semibold text-zinc-600">
              Create List
            </span>
          </button>
        </div>
      </header>
      <main>
        <ul className="flex flex-col font-semibold text-zinc-700">
          {projects.map((project) => (
            <li
              className="flex font-semibold border-b hover:bg-zinc-200 border-zinc-200"
              key={project._id}
            >
              <Link
                className="flex items-center w-full h-full gap-4 px-8 py-2"
                to={`/projects/${project._id}/taskLists`}
              >
                <FolderIcon className="size-4" />
                {project.title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
