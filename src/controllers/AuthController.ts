import { Request, Response } from "express";
import CustomError from "../helpers/CustomError";
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

  static async me(req: Request, res: Response) {
    const id = (req as any).user.id;

    if (!id) throw new CustomError("Se requiere id del usuario.", 400);

    const { error, data } = await AuthService.me(id);

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
      message: "Datos obtenidos exitosamente.",
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
