import React from "react";
import { Task, TaskList } from "./TaskSection";
import { updateTaskTaskListFnc } from "../../api";
import { useNavigate } from "react-router-dom";
import { Project } from "../../pages/Projects";

type Props = {
  project: Project;
  task: Task;
  taskLists: TaskList[];
  updateTaskTaskList: boolean;
  setUpdateTaskTaskList: React.Dispatch<React.SetStateAction<boolean>>;
  revalidator: any;
};

export default function UpdateTaskTaskListModal({
  project,
  task,
  taskLists,
  updateTaskTaskList,
  setUpdateTaskTaskList,
  revalidator,
}: Props) {
  const navigate = useNavigate();

  const handleUpdate = async (taskListId: string) => {
    try {
      if (task._id) {
        await updateTaskTaskListFnc(task._id, taskListId);
        setUpdateTaskTaskList(!updateTaskTaskList);

        navigate(
          `/projects/${project._id}/taskLists/${taskListId}/tasks/${task._id}`
        );
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div
      className={
        updateTaskTaskList
          ? "flex flex-col p-2 rounded-lg shadow-xl w-[7.5rem] overflow-hidden border-2 border-zinc-200 absolute top-0 -left-32 z-[100] bg-white"
          : "hidden"
      }
      onClick={() => setUpdateTaskTaskList(!updateTaskTaskList)}
    >
      {taskLists.map((taskList) => (
        <button
          className="rounded-lg hover:bg-zinc-200"
          key={taskList._id}
          type="button"
          onClick={() => handleUpdate(taskList._id!)}
        >
          {taskList.title}
        </button>
      ))}
    </div>
  );
}
