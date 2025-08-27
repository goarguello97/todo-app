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

  static async getUserByEmail(req: Request, res: Response) {
    const { email } = req.params;
    const { error, data } = await UserService.getUserByEmail(String(email));
    if (error) return res.status(404).json(data);
    return res.status(200).json(data);
  }

  static async updateUser(req: Request, res: Response) {
    const user = req.body;
    const { email } = req.params;
    const { error, data } = await UserService.updateUser({
      user,
      email: String(email),
    });
    if (error) return res.status(404).json(data);
    return res.status(200).json(data);
  }

  static async updatePassword(req: Request, res: Response) {
    const passwords = req.body;
    const { email } = req.params;
    const { error, data } = await UserService.updatePassword({
      passwords,
      email: String(email),
    });
    if (error) return res.status(404).json(data);
    return res.status(200).json(data);
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    const { error, data } = await UserService.deleteUser(id);
    if (error) return res.status(404).json(data);
    return res.status(200).json(data);
  }
}

export default UserController;
