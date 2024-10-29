import { useState } from "react";
import workspace from "../../assets/images/kaban-snapshot.png";
import custom from "../../assets/images/task-options.png";

type Props = {};

type Feature = "workspace" | "custom" | "collaborate";

export default function Features({}: Props) {
  const [displayedFeature, setDisplayedFeature] =
    useState<Feature>("workspace");

  return (
    <section className="relative flex items-center gap-16 mt-40">
      <div className="w-[40%] ml-[200px]">
        <h3 className="text-3xl font-medium">
          Manage effectively your time and all your projects
        </h3>
        <p className="mt-8">
          Task-team allows you to manage large scale projects, keeping track of
          deadlines, priority, asigned tasks.
        </p>
        <div className="flex flex-col mt-16">
          <article
            className={
              displayedFeature === "workspace"
                ? "px-6 py-8 border-l hover:bg-zinc-100 border-black"
                : "px-6 py-8 border-l hover:bg-zinc-100 border-zinc-200"
            }
            onClick={() => setDisplayedFeature("workspace")}
          >
            <h4>Organized workspace</h4>
            <p>We provide a kanban and list view to manage projects & tasks.</p>
          </article>
          <article
            className={
              displayedFeature === "custom"
                ? "px-6 py-8 border-l hover:bg-zinc-100 border-black"
                : "px-6 py-8 border-l hover:bg-zinc-100 border-zinc-200"
            }
            onClick={() => setDisplayedFeature("custom")}
          >
            <h4>Custom task</h4>
            <p>When task are created...</p>
          </article>
          <article
            className={
              displayedFeature === "collaborate"
                ? "px-6 py-8 border-l hover:bg-zinc-100 border-black"
                : "px-6 py-8 border-l hover:bg-zinc-100 border-zinc-200"
            }
            onClick={() => setDisplayedFeature("collaborate")}
          >
            <h4>Collaborate</h4>
            <p>Working together has never been that easy...</p>
          </article>
        </div>
      </div>

      <div className="w-[60%] flex justify-center">
        <img
          className={
            custom
              ? "h-[25rem] w-auto border-2 border-zinc-100 rounded-lg"
              : "w-full aspect-auto h-auto border-2 border-zinc-100 rounded-lg"
          }
          src={
            displayedFeature === "workspace"
              ? workspace
              : displayedFeature === "custom"
              ? custom
              : workspace
          }
          alt=""
        />
      </div>
    </section>
  );
}
