import { Request, Response } from "express";
import AuthService from "../services/AuthService";

class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const { error, data } = await AuthService.login({ email, password });
    if (error) {
      const errorResponse = {
        ...data,
        data: null,
        errors: null,
        success: false,
        meta: {
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      };
      return res.status(401).json(errorResponse);
    }
    const response = {
      success: true,
      message: "Inicio de sesión exitoso.",
      data,
      errors: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    };
    return res.status(200).json(response);
  }
}

export default AuthController;
