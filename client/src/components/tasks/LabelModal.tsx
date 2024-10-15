import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Label } from "../../pages/Task";
import { createLabel } from "../../api";

type Props = {
  labels: Label[];
  addLabel: boolean;
  setAddLabel: React.Dispatch<React.SetStateAction<boolean>>;
  revalidator: any;
};

export default function LabelModal({
  labels,
  addLabel,
  setAddLabel,
  revalidator,
}: Props) {
  const [displayAddBtn, setDisplayAddBtn] = useState<boolean>(false);

  const handleAddLabel = async (e) => {
    try {
      await createLabel(e.currentTarget.value);
      revalidator.revalidate();
      setAddLabel(!addLabel);
      e.currentTarget.value = "";
    } catch (error) {
      throw error;
    }
  };

  return (
    <div
      className={
        addLabel
          ? "flex flex-col py-2 rounded-lg shadow-xl w-[10rem] overflow-hidden border-2 border-zinc-200 absolute top-0 -left-32 z-[100] bg-white"
          : "hidden"
      }
    >
      <input
        className="px-2 outline-none"
        type="text"
        name="label"
        id="label"
        placeholder="add label..."
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
          onClick={(e) => handleAddLabel(e)}
        >
          <PlusIcon className="size-4" />
          <span className="text-sm font-semibold">create label</span>
        </button>
      ) : (
        <div className="px-2 py-1 border-t border-zinc-200">
          {labels.map((label) => (
            <label
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-zinc-200"
              key={label._id}
              htmlFor="label"
            >
              <input
                type="checkbox"
                name="label"
                id="label"
                value={`${label.label}`}
              />
              <span className="text-sm ">{label.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
