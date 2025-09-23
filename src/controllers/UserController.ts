import { Request, Response } from "express";
import UserService from "../services/UserService";

class UserController {
  static async createUser(req: Request, res: Response) {
    const user = req.body;
    const { error, data } = await UserService.createUser(user);
    if (error) {
      return res.status(data.code).json({
        success: false,
        message: data.message,
        data: null,
        errors: [data],
        meta: { timestamp: new Date().toISOString(), path: req.originalUrl },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente.",
      data,
      errors: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }

  static async getAll(req: Request, res: Response) {
    const { error, data } = await UserService.getAll();
    if (error) {
      return res.status(data.code).json({
        success: false,
        error: true,
        data,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Usuarios obtenidos correctamente.",
      data,
      errors: null,
      meta: {
        timestamp: new Date().toISOString(),
        total: Array.isArray(data) && data.length,
        path: req.originalUrl,
      },
    });
  }

  static async getUserByEmail(req: Request, res: Response) {
    const { email } = req.params;
    const { error, data } = await UserService.getUserByEmail(String(email));
    if (error) return res.status(404).json(data);
    return res.status(200).json(data);
  }

  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = req.body;

    const { error, data } = await UserService.updateUser({
      user,
      id: String(id),
    });
    if (error) {
      return res.status(data.code ?? 400).json({
        success: false,
        message: data.message,
        data: { id },
        errors: null,
        meta: {
          path: req.originalUrl,
          timestamp: new Date().toISOString(),
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente.",
      data,
      errors: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }

  static async updatePassword(req: Request, res: Response) {
    const passwords = req.body;
    const { id } = req.params;
    const { error, data } = await UserService.updatePassword({
      passwords,
      id: String(id),
    });
    if (error) {
      return res.status(data.code ?? 400).json({
        success: false,
        message: data.message,
        data: { id },
        errors: null,
        meta: {
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      });
    }
    return res.status(200).json({
      success: true,
      message: "Contraseña modificada con éxito.",
      data,
      errors: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    const { error, data } = await UserService.deleteUser(id);
    if (error) {
      return res.status(data.code ?? 400).json({
        success: false,
        message: data.message,
        data: { id },
        errors: null,
        meta: {
          path: req.originalUrl,
          timestamp: new Date().toISOString(),
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Usuario eliminado correctamente.",
      data: { id },
      errors: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }

  static async notFoundPath(req: Request, res: Response) {
    const response = {
      success: false,
      message: "El parámetro 'id' es requerido.",
      data: null,
      errors: [
        {
          field: "params",
          message: "Debe enviar el id del usuario en la URL.",
        },
      ],
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    };
    return res.status(400).json(response);
  }
}

export default UserController;
