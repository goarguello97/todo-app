import { Request, Response } from "express";
import UserService from "../services/UserService";

class UserController {
  static async createUser(req: Request, res: Response) {
    const user = req.body;
    const { error, data } = await UserService.createUser(user);
    if (error) return res.status(404).json(data);
    return res.status(200).json(data);
  }

  static async getAll(req: Request, res: Response) {
    const { error, data } = await UserService.getAll();
    if (error) return res.status(404).json(data);
    return res.status(200).json(data);
  }
}

export default UserController;
