import express from "express";
import UserController from "../controllers/UserController";

const router = express.Router();
const {
  getAll,
  createUser,
  getUserByEmail,
  updateUser,
  updatePassword,
  deleteUser,
} = UserController;

router.get("/", getAll);
router.post("/", createUser);
router.get("/:email", getUserByEmail);
router.put("/:email", updateUser);
router.put("/update-password/:email", updatePassword);
router.delete("/:id", deleteUser);

export default router;
