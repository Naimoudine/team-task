import React, { useState } from "react";
import { User } from "../../../store/user-store";
import { Task } from "./TaskSection";
import { updateTaskAssgined } from "../../../api";

type Props = {
  task: Task;
  updateAssign: boolean;
  setUpdateAssign: React.Dispatch<React.SetStateAction<boolean>>;
  members: User[];
  revalidator: any;
};

export default function AssignModal({
  task,
  updateAssign,
  setUpdateAssign,
  members,
  revalidator,
}: Props) {
  const handleOnChange = async (e: any) => {
    try {
      if (task._id) {
        console.log(e.currentTarget.value);
        await updateTaskAssgined(task._id, e.currentTarget.value);
        revalidator.revalidate();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message", error.message);
      } else {
        console.error("Error inattendu", error);
      }
    }
  };
  return (
    <div
      className={
        updateAssign
          ? "flex flex-col p-2 rounded-lg shadow-xl w-[7.5rem] overflow-hidden border-2 border-zinc-200 absolute top-0 -left-32 z-[100] bg-white"
          : "hidden"
      }
    >
      {members.map((member) => (
        <label
          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-zinc-200"
          key={member._id}
          htmlFor={`${member._id}`}
        >
          <input
            type="checkbox"
            name="label"
            id={member._id}
            value={`${member._id}`}
            onChange={(e) => handleOnChange(e)}
            checked={task?.assignedTo?.some((el) => el === member._id)}
          />
          <span className="text-sm">
            {member.firstname} {member.lastname}
          </span>
        </label>
      ))}
    </div>
  );
}
