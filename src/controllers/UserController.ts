import { Request, Response } from "express";
import UserService from "../services/UserService";

class UserController {
  static async createUser(req: Request, res: Response) {
    const user = req.body;
    const { error, data } = await UserService.createUser(user);
    if (error) {
      const errorResponse = {};
      console.log(data);
      const code = "code" in data && data.code;
      return res.status(code).json(errorResponse);
    }

    const response = {
      success: true,
      message: "Usuario registrado correctamente.",
      data,
      errors: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    };
    return res.status(201).json(response);
  }

  static async getAll(req: Request, res: Response) {
    const { error, data } = await UserService.getAll();
    if (error) {
      const errorResponse = {
        success: false,
        error: true,
        data,
      };
      return res.status(404).json(errorResponse);
    }
    const response = {
      success: true,
      message: "Usuarios obtenidos correctamente.",
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        total: Array.isArray(data) && data.length,
        path: req.originalUrl,
      },
      data,
    };
    return res.status(200).json(response);
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
      const errorResponse = {
        success: false,
        message: "message" in data && data.message,
        data: { id },
        errors: [
          {
            field: "id",
            message: "No existe un usuario con el id proporcionado.",
          },
        ],
        meta: {
          path: req.originalUrl,
          timestamp: new Date().toISOString(),
        },
      };

      return res.status(404).json(errorResponse);
    }

    const response = {
      success: true,
      message: "Usuario actualizado correctamente.",
      data,
      errors: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    };
    return res.status(200).json(response);
  }

  static async updatePassword(req: Request, res: Response) {
    const passwords = req.body;
    const { id } = req.params;
    const { error, data } = await UserService.updatePassword({
      passwords,
      id: String(id),
    });
    if (error) {
      const errorResponse = {
        success: false,
        message: "message" in data ? data.message : "",
        data: { id },
        errors: null,
        meta: {
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        },
      };

      const code = "code" in data ? data.code : 404;
      return res.status(code).json(errorResponse);
    }
    return res.status(200).json(data);
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    const { error, data } = await UserService.deleteUser(id);
    if (error) {
      const errorResponse = {
        success: false,
        message: data.message,
        data: { id },
        errors: [
          {
            field: "id",
            message: "No existe un usuario con el id proporcionado.",
          },
        ],
        meta: {
          path: req.originalUrl,
          timestamp: new Date().toISOString(),
        },
      };
      const code = "code" in data ? data.code : 400;
      return res.status(code).json(errorResponse);
    }

    const response = {
      success: true,
      message: "Usuario eliminado correctamente.",
      data: { id: "id" in data ? data.id : id },
      errors: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    };
    return res.status(200).json(response);
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
