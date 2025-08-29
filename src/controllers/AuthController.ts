import { Request, Response } from "express";
import AuthService from "../services/AuthService";

class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const { error, data } = await AuthService.login({ email, password });
    if (error) return res.status(404).json(data);
    return res.status(200).json(data);
  }
}

export default AuthController;
