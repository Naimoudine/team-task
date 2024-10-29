import { useState } from "react";
import workspace from "../../assets/images/kaban-snapshot-bg.png";
import custom from "../../assets/images/custom-snapshot-bg.png";

type Props = {};

type Feature = "workspace" | "custom" | "collaborate";

export default function Features({}: Props) {
  const [displayedFeature, setDisplayedFeature] =
    useState<Feature>("workspace");

  return (
    <section className="relative flex items-center gap-16 mt-40">
      <div className="w-[40%] ml-[12.5rem]">
        <h3 className="text-3xl font-medium">
          Manage effectively your time and all your projects
        </h3>
        <p className="mt-8">
          Task-Team helps you manage large-scale projects, track deadlines, set
          priorities, and assign tasks.
        </p>
        <div className="flex flex-col mt-16">
          <article
            className={
              displayedFeature === "workspace"
                ? "px-6 py-8 border-l-2 hover:bg-zinc-100 border-black"
                : "px-6 py-8 border-l hover:bg-zinc-100 border-zinc-200"
            }
            onClick={() => setDisplayedFeature("workspace")}
          >
            <h4 className="font-semibold">Organized workspace</h4>
            <p className="mt-2 text-sm">
              We provide a kanban and list view to manage projects & tasks.
            </p>
          </article>
          <article
            className={
              displayedFeature === "custom"
                ? "px-6 py-8 border-l-2 hover:bg-zinc-100 border-black"
                : "px-6 py-8 border-l hover:bg-zinc-100 border-zinc-200"
            }
            onClick={() => setDisplayedFeature("custom")}
          >
            <h4 className="font-semibold">Custom task</h4>
            <p className="mt-2 text-sm">When task are created...</p>
          </article>
          <article
            className={
              displayedFeature === "collaborate"
                ? "px-6 py-8 border-l-2 hover:bg-zinc-100 border-black"
                : "px-6 py-8 border-l hover:bg-zinc-100 border-zinc-200"
            }
            onClick={() => setDisplayedFeature("collaborate")}
          >
            <h4 className="font-semibold">Collaborate</h4>
            <p className="mt-2 text-sm">
              Working together has never been that easy...
            </p>
          </article>
        </div>
      </div>

      <div className="w-[60%] flex justify-center">
        <img
          className={
            displayedFeature === "custom" ? "h-[25rem] w-auto" : "w-full h-full"
          }
          src={
            displayedFeature === "workspace"
              ? workspace
              : displayedFeature === "custom"
              ? custom
              : workspace
          }
          alt=""
          loading="lazy"
        />
      </div>
    </section>
  );
}
