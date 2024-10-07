import express from "express";
import { getUsers } from "./modules/users/userController";

const router = express.Router();

router.get("/users", getUsers);

export default router;
