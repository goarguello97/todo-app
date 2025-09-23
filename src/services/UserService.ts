import bcrypt from "bcrypt";
import CustomError from "../helpers/CustomError";
import checkEmailExists from "../helpers/checkEmailExists";
import { execute } from "../helpers/execute";
import {
  CreateUser,
  UpdatePassword,
  UpdateUser,
} from "../interface/user.model";
import prisma from "../prisma";

class UserService {
  static async createUser(data: CreateUser) {
    const { password, email } = data;
    return execute(async () => {
      await checkEmailExists(email);
      const encryptedPassword = this.hashPassword(password);
      return prisma.user.create({
        data: { ...data, password: encryptedPassword },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          Task: true,
        },
      });
    });
  }

  static async getAll(includeTasks = true) {
    return execute(async () => {
      return prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          Task: includeTasks,
        },
      });
    });
  }

  static async getUserByEmail(email: string) {
    return execute(async () => {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          Task: true,
        },
      });

      if (!user) throw new CustomError("El usuario no existe.", 404);
      return user;
    });
  }

  static async updateUser(data: UpdateUser) {
    return execute(async () => {
      const { id, user } = data;
      if (!user || Object.keys(user).length === 0) {
        throw new CustomError(
          "No se proporcionaron datos para actualizar.",
          400
        );
      }

      const userToUpdate = await prisma.user.findUnique({
        where: { id },
      });

      if (!userToUpdate) throw new CustomError("Usuario no encontrado.", 404);

      return prisma.user.update({
        where: { id },
        data: user,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          Task: true,
        },
      });
    });
  }

  static async updatePassword(data: UpdatePassword) {
    return execute(async () => {
      const { id, passwords } = data;
      const { currentPassword, newPassword } = passwords;

      if (!passwords || !currentPassword || !newPassword) {
        throw new CustomError(
          "Se deben proporcionar la constraseña actual y la nueva contraseña.",
          400
        );
      }

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) throw new CustomError("Usuario no encontrado.", 404);

      const isValid = bcrypt.compareSync(currentPassword, user.password);
      if (!isValid) throw new CustomError("Contraseña actual incorrecta", 401);

      const encryptedPassword = this.hashPassword(newPassword);

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { password: encryptedPassword },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          Task: true,
        },
      });

      return updatedUser;
    });
  }

  static async deleteUser(id: string) {
    return execute(async () => {
      if (!id) throw new CustomError("El parámetro 'id' es requerido.", 400);

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) throw new CustomError("Usuario no encontrado.", 404);

      await prisma.user.delete({ where: { id } });
      return { user, message: "Usuario eliminado exitosamente." };
    });
  }

  private static hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}

export default UserService;
