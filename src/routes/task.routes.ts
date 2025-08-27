import express from "express";
import TaskController from "../controllers/TaskController";

const router = express.Router();
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask } =
  TaskController;

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
