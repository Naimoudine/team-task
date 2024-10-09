import express from "express";
import { getUsers } from "./modules/users/userController";
import { createTaskList, readAll } from "./modules/tasks/taskListController";
import { createTask, getTaskById } from "./modules/tasks/taskController";

const router = express.Router();

router.get("/users", getUsers);

// tasks
router.post("/taskLists", createTaskList);
router.post("/tasksLists/:id/tasks", createTask);
router.get("/taskLists", readAll);
router.get("/taskLists/:taskListId/tasks/:id", getTaskById);

export default router;
