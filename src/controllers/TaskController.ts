import { Request, Response } from "express";
import TaskService from "../services/TaskService";

class TaskController {
  static async createTask(req: Request, res: Response) {
    const task = req.body;
    const { error, data } = await TaskService.createTask(task);
    console.log(data);
    if (error) return res.status(404).json(data);
    return res.status(200).json(data);
  }
}

export default TaskController;
