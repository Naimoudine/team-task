import { Link, useLoaderData } from "react-router-dom";
import { getProjects } from "../api";
import { CubeIcon } from "@heroicons/react/24/outline";
import { FolderIcon } from "@heroicons/react/16/solid";

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
  const projects = useLoaderData() as Project[];

  console.log(projects);

  return (
    <div className="h-full">
      <header className="page-header">
        <h1 className="page-title">Projects</h1>
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
