import express from "express";
import { checkSchema } from "express-validator";
import UserController from "../controllers/UserController";
import { authenticationToken } from "../middlewares/auth";
import validateFields from "../middlewares/validateFields";
import passwordUpdate from "../schemas/passwordUpdate.schema";
import userCreate from "../schemas/userCreate.schema";
import userUpdate from "../schemas/userUpdate.schema";

const router = express.Router();
const {
  getAll,
  createUser,
  getUserByEmail,
  updateUser,
  updatePassword,
  deleteUser,
} = UserController;

router.get("/", authenticationToken, getAll);
router.post("/", checkSchema(userCreate), validateFields, createUser);
router.get("/:email", authenticationToken, getUserByEmail);
router.put(
  "/:email",
  authenticationToken,
  checkSchema(userUpdate),
  validateFields,
  updateUser
);
router.put(
  "/update-password/:email",
  authenticationToken,
  checkSchema(passwordUpdate),
  validateFields,
  updatePassword
);
router.delete("/:id", authenticationToken, deleteUser);

export default router;
