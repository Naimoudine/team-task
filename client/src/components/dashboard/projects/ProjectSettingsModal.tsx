import { TrashIcon } from "@heroicons/react/24/outline";
import React from "react";

type Props = {
  deleteProject: boolean;
  setDeleteProject: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirmDeleteProject: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProjectSettingsModal({
  deleteProject,
  setDeleteProject,
  setConfirmDeleteProject,
}: Props) {
  const handleDelete = () => {
    setDeleteProject(!deleteProject);
    setConfirmDeleteProject(true);
  };
  return (
    <div
      className={
        deleteProject
          ? "absolute p-2 bg-white border-2 rounded-lg top-8 border-zinc-200"
          : "hidden"
      }
    >
      <ul className="w-full">
        <li className="w-full px-2 py-1 rounded-lg hover:bg-zinc-100">
          <button
            className="flex items-center justify-center gap-2"
            type="button"
            onClick={() => handleDelete()}
          >
            <TrashIcon className="size-4" /> <span>delete</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
