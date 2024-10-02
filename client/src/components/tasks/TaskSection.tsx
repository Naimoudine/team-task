import { useState } from "react";
import { v4 as uuid } from "uuid";
import { DisplayType } from "../../pages/Tasks";
import TaskBoardView from "./TaskBoardView";
import TaskListView from "./TaskListView";

type Props = {
  display: DisplayType;
};

export interface Task {
  id: string;
  title: string;
  date?: Date;
  due?: Date;
  assingned?: string;
}

export interface TaskList {
  id: string;
  title: string;
  tasks: Task[];
}

export default function Tasksection({ display }: Props) {
  const [taskList, setTaskList] = useState<TaskList[]>([
    {
      id: uuid(),
      title: "todo",
      tasks: [
        {
          id: uuid(),
          title: "learn context manager",
        },
      ],
    },
  ]);

  return (
    <div className="w-full h-full">
      {display === "list" ? (
        <div className="w-full h-full">
          <TaskListView taskList={taskList} setTaskList={setTaskList} />
        </div>
      ) : (
        <div className="mx-2 w-full h-full flex gap-4 mt-2">
          <TaskBoardView taskList={taskList} setTaskList={setTaskList} />
        </div>
      )}
    </div>
  );
}