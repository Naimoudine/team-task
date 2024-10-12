import express from "express";
import { getUsers } from "./modules/users/userController";
import { createTaskList, readAll } from "./modules/tasks/taskListController";
import { createTask, getTaskById } from "./modules/tasks/taskController";
import { createProject } from "./modules/projects/projectController";

const router = express.Router();

router.get("/users", getUsers);

//projects
router.post("/projects", createProject);

// tasks
router.post("/projects/:id/taskLists", createTaskList);
router.post("/taskLists/:id/tasks", createTask);
router.get("/taskLists", readAll);
router.get("/taskLists/:taskListId/tasks/:id", getTaskById);

export default router;
