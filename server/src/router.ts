import express from "express";
import { getUsers } from "./modules/users/userController";
import {
  createTaskList,
  readById as taskListReadById,
  readTaskListsByProjectId,
} from "./modules/tasks/taskListController";
import {
  createTask,
  readTaskById,
  readTaskByTaskListId,
  updateTaskLabelList,
  updateTaskPriority,
} from "./modules/tasks/taskController";
import {
  createProject,
  readAll as projectReadAll,
  readById as projectReadById,
} from "./modules/projects/projectController";
import {
  createLabel,
  readAll as labelReadAll,
} from "./modules/label/labelController";

const router = express.Router();

router.get("/users", getUsers);

//projects
router.post("/projects", createProject);
router.get("/projects", projectReadAll);
router.get("/projects/:id", projectReadById);

// taskLists
router.get("/taskLists/:id", taskListReadById);
router.get("/projects/:id/taskLists", readTaskListsByProjectId);
router.post("/projects/:id/taskLists", createTaskList);

//task
router.post("/taskLists/:id/tasks", createTask);
router.get("/tasks/:id", readTaskById);
router.put("/tasks/:id/priority", updateTaskPriority);
router.put("/tasks/:id/label", updateTaskLabelList);

//label
router.post("/labels", createLabel);
router.get("/labels", labelReadAll);

export default router;
