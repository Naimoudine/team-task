import { ListBulletIcon, ViewColumnsIcon } from "@heroicons/react/16/solid";
import { DisplayType } from "../../pages/Tasks";
import type React from "react";

type Props = {
  display: DisplayType;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayType>>;
  isDisplayModal: boolean;
  setIsDisplayModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DisplayModal({
  display,
  setDisplay,
  isDisplayModal,
  setIsDisplayModal,
}: Props) {
  const handleDisplay = (type: DisplayType) => {
    setDisplay(type);
    setIsDisplayModal(false);
  };

  return (
    <div
      className={
        isDisplayModal
          ? "absolute top-8 right-0 p-2 rounded-lg border border-zinc-200 z-50 bg-white flex shadow-lg"
          : "hidden"
      }
    >
      <div className="flex items-center justify-center gap-2">
        <button
          className={
            display === "list"
              ? "border border-zinc-300 py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-200"
              : "border border-zinc-300 py-2 px-4 rounded-lg hover:bg-gray-200"
          }
          type="button"
          onClick={() => handleDisplay("list")}
        >
          <ListBulletIcon className="size-4 text-zinc-400" />
        </button>
        <button
          className={
            display === "board"
              ? "border border-zinc-300 py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-200"
              : "border border-zinc-300 py-2 px-4 rounded-lg hover:bg-gray-200"
          }
          type="button"
          onClick={() => handleDisplay("board")}
        >
          <ViewColumnsIcon className="size-4 text-zinc-400" />
        </button>
      </div>
    </div>
  );
}
