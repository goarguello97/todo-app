import express from "express";
import UserController from "../controllers/UserController";

const router = express.Router();
const { getAll, createUser } = UserController;

router.get("/", getAll);
router.post("/", createUser);

export default router;
