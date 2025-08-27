import normalizeError from "../helpers/normalizeError";
import prisma from "../prisma";

class TaskService {
  static async createTask(data: any) {
    try {
      const task = await prisma.task.create({ data });
      return { error: false, data: task };
    } catch (error: unknown) {
      return { error: true, data: normalizeError(error) };
    }
  }
}

export default TaskService;
