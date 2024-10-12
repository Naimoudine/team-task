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
} from "./modules/projects/projectController";

const router = express.Router();

router.get("/users", getUsers);

//projects
router.post("/projects", createProject);
router.get("/projects", projectReadAll);

// taskLists
router.get("/projects/:id/taskLists", readTaskListsByProjectId);
export default router;
