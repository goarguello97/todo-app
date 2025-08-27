import { Request, Response } from "express";
import TaskService from "../services/TaskService";

class TaskController {
  static async createTask(req: Request, res: Response) {
    const task = req.body;
    const { error, data } = await TaskService.createTask(task);
    if (error) return res.status(404).json(data);
    return res.status(200).json(data);
  }

  static async getAllTasks(req: Request, res: Response) {
    const { error, data } = await TaskService.getAllTasks();
    if (error) return res.status(404).json(data);
    return res.status(200).json(data);
  }

  static async getTaskById(req: Request, res: Response) {
    const { id } = req.params;
    const { error, data } = await TaskService.getTaskById(id);
    if (error) return res.status(404).json(data);
    return res.status(200).json(data);
  }

  static async updateTask(req: Request, res: Response) {
    const { id } = req.params;
    const task = req.body;
    const { error, data } = await TaskService.updateTask({ id, task });
    if (error) return res.status(404).json(data);
    return res.status(200).json(data);
  }

  static async deleteTask(req: Request, res: Response) {
    const { id } = req.params;
    const { error, data } = await TaskService.deleteTask(id);
    if (error) return res.status(404).json(data);
    return res.status(200).json(data);
  }
}

export default TaskController;
