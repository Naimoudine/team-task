import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { produce } from "immer";
import { Task, TaskList } from "../components/dashboard/tasks/TaskSection";

interface TaskListStore {
  taskLists: TaskList[];
  addToTaskLists: (taskList: TaskList) => void;
  addTask: (listId: string, task: Task) => void;
}

export const useTaskListStore = create<TaskListStore>((set) => ({
  taskLists: [
    {
      id: uuid(),
      title: "todo",
      tasks: [
        {
          id: uuid(),
          title: "learn context manager",
          priority: 1,
        },
      ],
    },
    {
      id: uuid(),
      title: "in progress",
      tasks: [
        {
          id: uuid(),
          title: "learn context manager",
          priority: 1,
        },
      ],
    },
  ],
  addToTaskLists: (taskList) =>
    set((state) => ({ taskLists: [...state.taskLists, taskList] })),
  addTask: (listId, task) =>
    set(
      produce((state) => {
        const currList = state.taskLists.find((l: Task) => l.id === listId);
        if (currList) {
          currList.tasks.push(task);
        }
      })
    ),
}));
