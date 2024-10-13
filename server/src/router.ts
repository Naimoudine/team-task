import express from "express";
import { getUsers } from "./modules/users/userController";
import {
  createTaskList,
  readTaskListsByProjectId,
  readAll as taskListReadAll,
} from "./modules/tasks/taskListController";
import { createTask, getTaskById } from "./modules/tasks/taskController";
import {
  createProject,
  readAll as projectReadAll,
  readById as projectReadById,
} from "./modules/projects/projectController";

const router = express.Router();

router.get("/users", getUsers);

//projects
router.post("/projects", createProject);
router.get("/projects", projectReadAll);
router.get("/projects/:id", projectReadById);

// taskLists
router.get("/projects/:id/taskLists", readTaskListsByProjectId);
router.post("/projects/:id/taskLists", createTaskList);
export default router;
