import express from "express";
import authRouter from "./auth.routes";
import taskRouter from "./task.routes";
import userRouter from "./user.routes";
const router = express.Router();

router.use("/users", userRouter);
router.use("/tasks", taskRouter);
router.use("/auth", authRouter);

export default router;
