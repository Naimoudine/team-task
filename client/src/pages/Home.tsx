import { useLoaderData, useNavigate } from "react-router-dom";
import { getProjects, getTasks } from "../api";
import { Task } from "../components/dashboard/tasks/TaskSection";
import { Project } from "./Projects";

type Props = {};

interface LoaderType {
  projects: Project[];
  tasks: Task[];
}

export const loader = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem("userId") as string);
    const projects = await getProjects(userId);
    const tasks = await getTasks(userId);
    return { projects, tasks };
  } catch (error) {
    console.error("Error fetching data:", error); // Log the error
    throw new Error("Failed to load projects and tasks"); // Throw a custom error message
  }
};

export default function Home({}: Props) {
  const { projects, tasks } = useLoaderData() as LoaderType;
  const navigate = useNavigate();

  return (
    <section className="wrapper">
      <header>
        <h1 className="page-title">Home</h1>
      </header>
      <div className="flex justify-between gap-8 p-4 mt-8 border-2 rounded-lg w-fit border-zinc-200">
        <article className="px-4 border-r-2 border-dashed border-zinc-200">
          <h2 className="font-semibold text-center text-zinc-600">
            Total Projects
          </h2>
          <p className="text-xl font-bold">{projects?.length}</p>
        </article>
        <article className="px-4 border-r-2 border-dashed border-zinc-200">
          <h2 className="font-semibold text-center text-zinc-600">
            Total Tasks
          </h2>
          <p className="text-xl font-bold">{tasks?.length}</p>
        </article>
        <article>
          <h2 className="font-semibold text-center text-zinc-600">
            Team members
          </h2>
          <p className="text-xl font-bold">0</p>
        </article>
      </div>
      <div className="grid w-full grid-cols-2 grid-rows-2 gap-8 mt-8">
        <div
          className={
            projects.length > 0
              ? "p-4 border-2 rounded-lg border-zinc-200 h-[250px]"
              : "p-4 flex items-center justify-center border-2 rounded-lg border-zinc-200 h-[250px]"
          }
        >
          <ul>
            {projects.length > 0 ? (
              projects.map((project, i) => (
                <li
                  className={
                    i + 1 !== projects?.length
                      ? "flex items-center justify-between px-4 py-2 border-b border-zinc-200"
                      : "flex items-center justify-between px-4 py-2"
                  }
                  key={project?._id}
                >
                  <h3>{project?.title}</h3>
                  <button
                    className="px-4 py-2 border rounded-lg border-zinc-200 hover:bg-zinc-100"
                    type="button"
                    onClick={() =>
                      navigate(`/projects/${project?._id}/taskLists`)
                    }
                  >
                    visit
                  </button>
                </li>
              ))
            ) : (
              <h3 className="font-semibold">You have no projects</h3>
            )}
          </ul>
        </div>
        <div className="flex items-center justify-center p-4 border-2 rounded-lg border-zinc-200">
          <h3 className="font-semibold">Coming soon tasks asigned to you</h3>
        </div>
        <div className="flex items-center justify-center p-4 border-2 rounded-lg border-zinc-200">
          <h3 className="font-semibold">Coming soon your team members</h3>
        </div>
      </div>
    </section>
  );
}
