import { TrashIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import React from "react";

type Props = {
  deleteProject: boolean;
  setDeleteProject: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirmDeleteProject: React.Dispatch<React.SetStateAction<boolean>>;
  displayAddMember: boolean;
  setDisplayAddMember: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProjectSettingsModal({
  deleteProject,
  setDeleteProject,
  setConfirmDeleteProject,
  displayAddMember,
  setDisplayAddMember,
}: Props) {
  const handleDelete = () => {
    setDeleteProject(!deleteProject);
    setConfirmDeleteProject(true);
  };
  return (
    <div
      className={
        deleteProject
          ? "absolute p-2 bg-white border-2 rounded-lg top-8 border-zinc-200 w-fit"
          : "hidden"
      }
    >
      <ul className="w-full">
        <li className="w-full px-2 py-1 rounded-lg hover:bg-zinc-100">
          <button
            className="flex items-center justify-center gap-2"
            type="button"
            onClick={() => setDisplayAddMember(!displayAddMember)}
          >
            <UserPlusIcon className="size-4" />{" "}
            <span className="text-sm whitespace-nowrap">add member</span>
          </button>
        </li>
        <li className="w-full px-2 py-1 rounded-lg hover:bg-zinc-100">
          <button
            className="flex items-center justify-center gap-2"
            type="button"
            onClick={() => handleDelete()}
          >
            <TrashIcon className="size-4" />{" "}
            <span className="text-sm whitespace-nowrap">delete</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
