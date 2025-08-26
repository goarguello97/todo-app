import express from "express";
import TaskController from "../controllers/TaskController";

const router = express.Router();
const { createTask } = TaskController;

router.post("/", createTask);

export default router;
