import prisma from "../prisma";

class TaskService {
  static async createTask(data: any) {
    try {
      const task = await prisma.task.create({ data });
      return { error: false, data: task };
    } catch (error: any) {
      return { error: true, data: error };
    }
  }
}

export default TaskService;
