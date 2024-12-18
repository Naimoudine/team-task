import express from "express";
import {
  createUser,
  readAll as userReadAll,
  readById as userReadById,
} from "./modules/users/userController";
import {
  createTaskList,
  readById as taskListReadById,
  readTaskListsByProjectId,
  deleteTaskList,
} from "./modules/tasks/taskListController";
import {
  createTask,
  readAll as tasksReadAll,
  readTaskById,
  updateTaskLabelList,
  updateTaskPriority,
  updateTaskTaskList,
  updateTaskDescription,
  updateTaskDate,
  updateTaskDue,
  deleteTask,
} from "./modules/tasks/taskController";
import {
  createProject,
  deleteProject,
  readAll as projectReadAll,
  readById as projectReadById,
  readProjectsByUserId,
} from "./modules/projects/projectController";
import {
  createLabel,
  readAll as labelReadAll,
} from "./modules/label/labelController";
import { hashPassword, verifyToken } from "./service/auth";
import { isLoggedIn, login, logout } from "./modules/users/authAction";

const router = express.Router();

//projects
router.post("/users/:id/projects", createProject);
router.get("/users/:id/projects", readProjectsByUserId);
router.get("/projects/:id", projectReadById);
router.delete("/projects/:id", deleteProject);

// taskLists
router.get("/taskLists/:id", taskListReadById);
router.get("/projects/:id/taskLists", readTaskListsByProjectId);
router.post("/projects/:id/taskLists", createTaskList);
router.delete("/taskLists/:id", deleteTaskList);

//task
router.get("/users/:id/tasks", tasksReadAll);
router.post("/users/:userId/taskLists/:id/tasks", createTask);
router.get("/tasks/:id", readTaskById);
router.put("/tasks/:id/priority", updateTaskPriority);
router.put("/tasks/:id/label", updateTaskLabelList);
router.put("/tasks/:id/taskLists/:taskListId", updateTaskTaskList);
router.put("/tasks/:id/description", updateTaskDescription);
router.put("/tasks/:id/date", updateTaskDate);
router.put("/tasks/:id/due", updateTaskDue);
router.delete("/tasks/:id/delete", deleteTask);

//label
router.post("/labels", createLabel);
router.get("/labels", labelReadAll);

//user
router.get("/users", userReadAll);
router.get("/users/:id", verifyToken, userReadById);
router.post("/users", hashPassword, createUser);

//login
router.post("/login", login);

//verify-auth
router.post("/verify-auth", verifyToken, isLoggedIn);

//logout
router.get("/logout", verifyToken, logout);
export default router;
