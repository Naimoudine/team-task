import React, { useState } from "react";
import { DisplayType } from "../../../pages/TaskLists";
import AddTaskModal from "./AddTaskModal";
import TaskBoardView from "./TaskBoardView";
import TaskListView from "./TaskListView";
import { deleteTaskList } from "../../../api";

type Props = {
  display: DisplayType;
  taskLists: TaskList[];
  revalidator: any;
  projectId: string;
  currentTaskList: TaskList | null;
  setCurrentTaskList: React.Dispatch<React.SetStateAction<TaskList | null>>;
  setConfirmDeleteTaskList: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface Task {
  _id?: string;
  title: string;
  description?: string;
  priority: 1 | 2 | 3;
  date?: Date;
  due?: Date;
  assigned?: string;
  labelList: string[];
}

export interface TaskList {
  _id?: string;
  title: string;
  tasksDetails?: Task[];
}

export const displayPriority = (priority: number) => {
  if (priority === 1) {
    return "Low";
  } else if (priority === 2) {
    return "Medium";
  } else {
    return "High";
  }
};

export default function Tasksection({
  display,
  taskLists,
  revalidator,
  projectId,
  currentTaskList,
  setCurrentTaskList,
  setConfirmDeleteTaskList,
}: Props) {
  const [displayAddTask, setDisplayAddTask] = useState<boolean>(false);

  return (
    <div className="w-full h-full overflow-scroll">
      <AddTaskModal
        displayAddTask={displayAddTask}
        setDisplayAddTask={setDisplayAddTask}
        currentTaskList={currentTaskList}
        revalidator={revalidator}
      />
      {display === "list" ? (
        <div className="w-full h-full">
          <TaskListView
            setDisplayAddTask={setDisplayAddTask}
            taskLists={taskLists}
            projectId={projectId}
            setCurrentTaskList={setCurrentTaskList}
            setConfirmDeleteTaskList={setConfirmDeleteTaskList}
          />
        </div>
      ) : (
        <div className="flex w-full h-full gap-4 mt-2">
          <TaskBoardView
            setDisplayAddTask={setDisplayAddTask}
            taskLists={taskLists}
            projectId={projectId}
            setCurrentTaskList={setCurrentTaskList}
            setConfirmDeleteTaskList={setConfirmDeleteTaskList}
          />
        </div>
      )}
    </div>
  );
}
