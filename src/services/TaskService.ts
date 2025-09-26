import CustomError from "../helpers/CustomError";
import { execute } from "../helpers/execute";
import { CreateTask, UpdateTask } from "../interface/task.model";
import prisma from "../prisma";

class TaskService {
  static async createTask(data: CreateTask) {
    return execute(async () => {
      const { userId } = data;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new CustomError("Usuario no encontrado.", 404);
      return prisma.task.create({ data });
    });
  }

  static async getAllTasks() {
    return execute(async () => {
      return prisma.task.findMany();
    });
  }

  static async getTaskById(id: string) {
    return execute(async () => {
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task) throw new CustomError("Tarea no encontrada.", 404);

      return task;
    });
  }

  static async updateTask(data: UpdateTask) {
    return execute(async () => {
      const { id, task } = data;
      const searchTask = await prisma.task.findUnique({ where: { id } });
      if (!searchTask) throw new CustomError("Tarea no encontrada.", 404);
      return prisma.task.update({
        where: { id },
        data: task,
      });
    });
  }

  static async deleteTask(id: string) {
    return execute(async () => {
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task) throw new CustomError("Tarea no encontrada.", 404);

      await prisma.task.delete({ where: { id } });

      return { task, message: "Tarea eliminada exitosamente." };
    });
  }
}

export default TaskService;
