import express from "express";
import { checkSchema } from "express-validator";
import TaskController from "../controllers/TaskController";
import { authenticationToken } from "../middlewares/auth";
import validateFields from "../middlewares/validateFields";
import taskCreate from "../schemas/taskCreate.schema";
import taskUpdate from "../schemas/taskUpdate.schema";

const router = express.Router();
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask } =
  TaskController;

router.get("/:userId", authenticationToken, getAllTasks);
//router.get("/:id", authenticationToken, getTaskById);
router.post(
  "/",
  authenticationToken,
  checkSchema(taskCreate),
  validateFields,
  createTask
);
router.put(
  "/:id",
  authenticationToken,
  checkSchema(taskUpdate),
  validateFields,
  updateTask
);
router.delete("/:id", authenticationToken, deleteTask);

export default router;
