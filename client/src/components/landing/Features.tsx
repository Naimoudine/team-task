import { useState } from "react";
import workspace from "../../assets/images/kaban-snapshot-bg.png";
import custom from "../../assets/images/custom-snapshot-bg.png";

type Props = {};

type Feature = "workspace" | "custom" | "collaborate";

export default function Features({}: Props) {
  const [displayedFeature, setDisplayedFeature] =
    useState<Feature>("workspace");

  return (
    <section className="relative flex flex-col gap-16 mt-40 xl:items-center xl:flex-row">
      <div className="w-full xl:w-[40%] xl:ml-[12.5rem]">
        <h3 className="text-2xl font-medium xl:text-3xl">
          Manage effectively your time and all your projects
        </h3>
        <p className="mt-8">
          Task-Team helps you manage large-scale projects, track deadlines, set
          priorities, and assign tasks.
        </p>
        <div className="flex flex-row mt-16 xl:flex-col">
          <article
            className={
              displayedFeature === "workspace"
                ? "px-6 py-8 border-t-2 xl:border-l-2 hover:bg-zinc-100 border-black cursor-pointer"
                : "px-6 py-8 border-t xl:border-l hover:bg-zinc-100 border-zinc-200 cursor-pointer"
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
                ? "px-6 py-8 border-t-2 xl:border-l-2 hover:bg-zinc-100 border-black cursor-pointer"
                : "px-6 py-8 border-t xl: hover:bg-zinc-100 border-zinc-200 cursor-pointer"
            }
            onClick={() => setDisplayedFeature("custom")}
          >
            <h4 className="font-semibold">Custom task</h4>
            <p className="mt-2 text-sm">When task are created...</p>
          </article>
          <article
            className={
              displayedFeature === "collaborate"
                ? "px-6 py-8 border-t-2 xl:border-l-2 hover:bg-zinc-100 border-black cursor-pointer"
                : "px-6 py-8 border-t xl: hover:bg-zinc-100 border-zinc-200 cursor-pointer"
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

      <div className="xl:w-[60%] w-full flex justify-center">
        <img
          className={"w-full h-full"}
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
