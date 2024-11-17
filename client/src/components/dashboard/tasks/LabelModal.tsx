import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { Label } from "../../../pages/Task";
import { createLabel, updateLabel } from "../../../api";
import { Task } from "./TaskSection";

type Props = {
  task: Task;
  labels: Label[];
  addLabel: boolean;
  setAddLabel: React.Dispatch<React.SetStateAction<boolean>>;
  revalidator: any;
};

export default function LabelModal({
  task,
  labels,
  addLabel,
  setAddLabel,
  revalidator,
}: Props) {
  const [displayAddBtn, setDisplayAddBtn] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleAddLabel = async () => {
    try {
      if (inputRef.current && inputRef.current.value) {
        await createLabel(inputRef.current.value);
        setAddLabel(!addLabel);
        inputRef.current.value = "";
        setDisplayAddBtn(false);
        revalidator.revalidate();
      }
    } catch (error) {
      throw error;
    }
  };

  const handleOnChange = async (e: any) => {
    try {
      if (task._id) {
        await updateLabel(task._id, e.currentTarget.value);
        revalidator.revalidate();
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div
      className={
        addLabel
          ? "flex flex-col py-2 rounded-lg shadow-xl w-[10rem] overflow-hidden border-2 border-zinc-200 absolute top-0 -left-44 z-[100] bg-white"
          : "hidden"
      }
      ref={modalRef}
    >
      <input
        className="px-2 outline-none"
        type="text"
        name="label"
        id="label"
        placeholder="add label..."
        ref={inputRef}
        onChange={(e) => {
          if (
            e.currentTarget.value !== "" &&
            !labels.some(
              (el) =>
                (el.label.toLocaleLowerCase() as string) ===
                e.currentTarget.value.toLocaleLowerCase()
            )
          ) {
            setDisplayAddBtn(true);
          } else {
            setDisplayAddBtn(false);
          }
        }}
      />

      {displayAddBtn ? (
        <button
          className="flex items-center justify-center w-full gap-2 py-1 rounded-lg hover:bg-zinc-200 z-60"
          type="button"
          aria-label="add label"
          onClick={handleAddLabel}
        >
          <PlusIcon className="size-4" />
          <span className="text-sm font-semibold">create label</span>
        </button>
      ) : (
        <div className="px-2 py-1 border-t border-zinc-200">
          {labels.map((label) => (
            <label
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-zinc-200"
              key={label.label}
              htmlFor={`${label.label}`}
            >
              <input
                type="checkbox"
                name="label"
                id="label"
                value={`${label.label}`}
                onChange={(e) => handleOnChange(e)}
                checked={task.labelList.some((el) => el === label.label)}
              />
              <span className="text-sm">{label.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
