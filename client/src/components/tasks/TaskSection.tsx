import { useState } from "react";
import { DisplayType } from "../../pages/TaskLists";
import AddTaskModal from "./AddTaskModal";
import TaskBoardView from "./TaskBoardView";
import TaskListView from "./TaskListView";

type Props = {
  display: DisplayType;
  taskLists: TaskList[];
  revalidator: any;
};

export interface Task {
  _id?: string;
  title: string;
  description?: string;
  priority: 1 | 2 | 3;
  date?: Date;
  due?: Date;
  assigned?: string;
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
}: Props) {
  const [displayAddTask, setDisplayAddTask] = useState<boolean>(false);
  const [currentListId, setCurrentListId] = useState<string | undefined>(
    undefined
  );

  return (
    <div className="w-full h-full overflow-scroll">
      <AddTaskModal
        displayAddTask={displayAddTask}
        setDisplayAddTask={setDisplayAddTask}
        currentListId={currentListId}
        revalidator={revalidator}
      />
      {display === "list" ? (
        <div className="w-full h-full">
          <TaskListView
            setDisplayAddTask={setDisplayAddTask}
            setCurrentListId={setCurrentListId}
            taskLists={taskLists}
          />
        </div>
      ) : (
        <div className="flex w-full h-full gap-4 mt-2">
          <TaskBoardView
            setDisplayAddTask={setDisplayAddTask}
            setCurrentListId={setCurrentListId}
            taskLists={taskLists}
          />
        </div>
      )}
    </div>
  );
}
