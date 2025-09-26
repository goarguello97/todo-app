import { Request, Response } from "express";
import TaskService from "../services/TaskService";

class TaskController {
  static async createTask(req: Request, res: Response) {
    const task = req.body;
    const { error, data } = await TaskService.createTask(task);
    if (error)
      return res.status(data.code && data.code | 400).json({
        success: false,
        message: data.message,
        data: null,
        errors: null,
        meta: { timestamp: new Date().toISOString(), path: req.originalUrl },
      });
    return res.status(201).json({
      success: true,
      message: "Tarea creada correctamente.",
      data,
      errors: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }

  static async getAllTasks(req: Request, res: Response) {
    const { error, data } = await TaskService.getAllTasks();
    if (error) return res.status(data.code && data.code | 404).json(data);
    return res.status(200).json({
      success: true,
      message: "Tareas obtenidas correctamente.",
      errors: null,
      meta: {
        timestamp: new Date().toISOString(),
        total: Array.isArray(data) && data.length,
        path: req.originalUrl,
      },
      data,
    });
  }

  static async getTaskById(req: Request, res: Response) {
    const { id } = req.params;
    const { error, data } = await TaskService.getTaskById(id);
    if (error)
      return res.status(data.code && data.code | 404).json({
        success: false,
        message: data.message,
        data: null,
        errors: null,
        meta: {
          timestamp: new Date().toISOString(),
          total: Array.isArray(data) && data.length,
          path: req.originalUrl,
        },
      });
    return res.status(200).json({
      success: true,
      message: "Tarea encontrada.",
      data,
      errors: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }

  static async updateTask(req: Request, res: Response) {
    const { id } = req.params;
    const task = req.body;
    const { error, data } = await TaskService.updateTask({ id, task });
    if (error)
      return res.status(data.code).json({
        success: false,
        message: data.message,
        data: null,
        errors: null,
        meta: {
          timestamp: new Date().toISOString(),
          total: Array.isArray(data) && data.length,
          path: req.originalUrl,
        },
      });
    return res.status(200).json({
      success: true,
      message: "Tarea modificada correctamente.",
      data,
      errors: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }

  static async deleteTask(req: Request, res: Response) {
    const { id } = req.params;
    const { error, data } = await TaskService.deleteTask(id);
    if (error)
      return res.status(data.code).json({
        success: false,
        message: data.message,
        data: null,
        errors: null,
        meta: {
          timestamp: new Date().toISOString(),
          total: Array.isArray(data) && data.length,
          path: req.originalUrl,
        },
      });
    return res.status(200).json({
      success: true,
      message: "Tarea eliminada correctamente.",
      data: { id },
      errors: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }
}

export default TaskController;
