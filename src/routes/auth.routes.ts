import express from "express";
import { checkSchema } from "express-validator";
import AuthController from "../controllers/AuthController";
import validateFields from "../middlewares/validateFields";
import userLogin from "../schemas/userLogin.schema";

const router = express.Router();
const { login } = AuthController;

router.post("/login", checkSchema(userLogin), validateFields, login);

export default router;
