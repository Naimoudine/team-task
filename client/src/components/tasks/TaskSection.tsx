import { useState } from "react";
import { DisplayType } from "../../pages/Tasks";
import AddTaskModal from "./AddTaskModal";
import TaskBoardView from "./TaskBoardView";
import TaskListView from "./TaskListView";

type Props = {
  display: DisplayType;
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 1 | 2 | 3;
  date?: Date;
  due?: Date;
  assingned?: string;
}

export interface TaskList {
  id: string;
  title: string;
  tasks: Task[];
}

export const displayPriority = (priority: number) => {
  if (priority === 1) {
    return "Low";
  } else if (priority === 1) {
    return "Medium";
  } else {
    return "High";
  }
};

export default function Tasksection({ display }: Props) {
  const [displayAddTask, setDisplayAddTask] = useState<boolean>(false);
  const [currentListId, setCurrentListId] = useState<string | undefined>(
    undefined
  );

  return (
    <div className="w-full h-full">
      <AddTaskModal
        displayAddTask={displayAddTask}
        setDisplayAddTask={setDisplayAddTask}
        currentListId={currentListId}
      />
      {display === "list" ? (
        <div className="w-full h-full">
          <TaskListView
            setDisplayAddTask={setDisplayAddTask}
            setCurrentListId={setCurrentListId}
          />
        </div>
      ) : (
        <div className="flex w-full h-full gap-4 mx-2 mt-2">
          <TaskBoardView
            setDisplayAddTask={setDisplayAddTask}
            setCurrentListId={setCurrentListId}
          />
        </div>
      )}
    </div>
  );
}
