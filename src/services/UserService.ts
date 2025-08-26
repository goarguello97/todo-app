import prisma from "../prisma";

class UserService {
  static async createUser(data: any) {
    try {
      const user = await prisma.user.create({ data });
      return { error: false, data: user };
    } catch (error: any) {
      return { error: true, data: error };
    }
  }

  static async getAll() {
    try {
      const users = await prisma.user.findMany({ include: { Task: true } });
      return { error: false, data: users };
    } catch (error: any) {
      return { error: true, data: error };
    }
  }
}

export default UserService;
