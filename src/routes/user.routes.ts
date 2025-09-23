import express from "express";
import { checkSchema } from "express-validator";
import UserController from "../controllers/UserController";
import { authenticationToken } from "../middlewares/auth";
import validateFields from "../middlewares/validateFields";
import validateIdParam from "../middlewares/validateParam";
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
  notFoundPath,
  deleteUser,
} = UserController;

router.get("/", authenticationToken, getAll);
router.post("/", checkSchema(userCreate), validateFields, createUser);
router.get("/:email", authenticationToken, getUserByEmail);

router.put("/update-password", authenticationToken, notFoundPath);
router.put(
  "/update-password/:id",
  authenticationToken,
  validateIdParam,
  checkSchema(passwordUpdate),
  validateFields,
  updatePassword
);

router.put(
  "/",
  authenticationToken,
  checkSchema(userUpdate),
  validateFields,
  notFoundPath
);
router.put(
  "/:id",
  authenticationToken,
  checkSchema(userUpdate),
  validateFields,
  updateUser
);

router.delete("/", authenticationToken, notFoundPath);
router.delete("/:id", authenticationToken, validateIdParam, deleteUser);

export default router;
