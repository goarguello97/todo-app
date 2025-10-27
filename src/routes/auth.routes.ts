import express from "express";
import { checkSchema } from "express-validator";
import AuthController from "../controllers/AuthController";
import { authenticationToken } from "../middlewares/auth";
import validateFields from "../middlewares/validateFields";
import userLogin from "../schemas/userLogin.schema";

const router = express.Router();
const { login, me } = AuthController;

router.post("/login", checkSchema(userLogin), validateFields, login);
router.get("/me", authenticationToken, me);

export default router;
