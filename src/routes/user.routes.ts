import express from "express";
import UserController from "../controllers/UserController";

const router = express.Router();
const { getAll, createUser, getUserByEmail, updateUser, updatePassword } =
  UserController;

router.get("/", getAll);
router.post("/", createUser);
router.get("/search", getUserByEmail);
router.put("/", updateUser);
router.put("/update-password", updatePassword);

export default router;
