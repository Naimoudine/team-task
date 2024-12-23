import {
  ArrowRightStartOnRectangleIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { useUserStore } from "../../../store/user-store";
import { leaveProject } from "../../../api";
import { useNavigate } from "react-router-dom";

type Props = {
  projectId: string;
  displaySettings: boolean;
  setDisplaySettings: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirmDeleteProject: React.Dispatch<React.SetStateAction<boolean>>;
  displayAddMember: boolean;
  setDisplayAddMember: React.Dispatch<React.SetStateAction<boolean>>;
  ownerId: string;
  revalidator: any;
};

export default function ProjectSettingsModal({
  projectId,
  displaySettings,
  setDisplaySettings,
  setConfirmDeleteProject,
  displayAddMember,
  setDisplayAddMember,
  ownerId,
  revalidator,
}: Props) {
  const { userId } = useUserStore();

  const navigate = useNavigate();

  const handleDelete = () => {
    setDisplaySettings(!displaySettings);
    setConfirmDeleteProject(true);
  };

  const handleLeave = async () => {
    try {
      if (projectId && userId) {
        await leaveProject(projectId, userId);
        revalidator.revalidate();
        setDisplaySettings(!displaySettings);
        navigate("/projects");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Message d'erreur :", error.message);
      } else {
        console.error("Erreur innatendu :", error);
      }
    }
  };

  return (
    <div
      className={
        displaySettings
          ? "absolute p-2 bg-white border-2 rounded-lg top-8 border-zinc-200 w-fit"
          : "hidden"
      }
    >
      <ul className="w-full">
        <li className="w-full px-2 py-1 rounded-lg hover:bg-zinc-100">
          <button
            className="flex items-center justify-center gap-2"
            type="button"
            onClick={() => {
              setDisplayAddMember(!displayAddMember);
              setDisplaySettings(!displaySettings);
            }}
          >
            <UserPlusIcon className="size-4" />{" "}
            <span className="text-sm whitespace-nowrap">add member</span>
          </button>
        </li>
        {ownerId === userId ? (
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
        ) : (
          <li className="w-full px-2 py-1 rounded-lg hover:bg-zinc-100">
            <button
              className="flex items-center justify-center gap-2"
              type="button"
              onClick={() => handleLeave()}
            >
              <ArrowRightStartOnRectangleIcon className="size-4" />{" "}
              <span className="text-sm whitespace-nowrap">leave</span>
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
