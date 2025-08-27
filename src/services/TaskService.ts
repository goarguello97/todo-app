import CustomError from "../helpers/CustomError";
import checkTaskExists from "../helpers/checkTaskExists";
import normalizeError from "../helpers/normalizeError";
import { CreateTask, UpdateTask } from "../interface/task.model";
import prisma from "../prisma";

class TaskService {
  static async createTask(data: CreateTask) {
    try {
      const { userId } = data;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new CustomError("El usuario no existe", 404);
      const createdTask = await prisma.task.create({ data });
      return { error: false, data: createdTask };
    } catch (error: unknown) {
      return { error: true, data: normalizeError(error) };
    }
  }

  static async getAllTasks() {
    try {
      const tasks = await prisma.task.findMany();
      return { error: false, data: tasks };
    } catch (error) {
      return { error: true, data: normalizeError(error) };
    }
  }

  static async getTaskById(data: string) {
    try {
      const id = data;
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task) throw new CustomError("La tarea no existe", 404);
      return { error: false, data: task };
    } catch (error) {
      return { error: true, data: normalizeError(error) };
    }
  }

  static async updateTask(data: UpdateTask) {
    try {
      const { id, task } = data;
      await checkTaskExists(id);
      const updatedTask = await prisma.task.update({
        where: { id },
        data: task,
      });
      return { error: false, data: updatedTask };
    } catch (error) {
      return { error: true, data: normalizeError(error) };
    }
  }

  static async deleteTask(data: string) {
    try {
      const id = data;
      await checkTaskExists(id);
      const deletedTask = await prisma.task.delete({ where: { id } });
      return {
        error: false,
        data: { message: "Tarea eliminada exitosamente." },
      };
    } catch (error) {
      return { error: true, data: normalizeError(error) };
    }
  }
}

export default TaskService;
