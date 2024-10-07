import express from "express";
import { getUsers } from "./modules/users/userController";
import { createTaskList } from "./modules/tasks/taskListController";
import { createTask } from "./modules/tasks/taskController";

const router = express.Router();

router.get("/users", getUsers);

// tasks
router.post("/tasks", createTaskList);
router.post("/tasks/:id", createTask);

export default router;
