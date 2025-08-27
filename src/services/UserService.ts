import bcrypt from "bcrypt";
import CustomError from "../helpers/CustomError";
import checkEmailExists from "../helpers/checkEmailExists";
import checkUserExists from "../helpers/checkUserExists";
import normalizeError from "../helpers/normalizeError";
import {
  CreateUser,
  UpdatePassword,
  UpdateUser,
} from "../interface/user.model";
import prisma from "../prisma";

class UserService {
  static async createUser(data: CreateUser) {
    const { password, email } = data;
    try {
      await checkEmailExists(email);
      const salt = bcrypt.genSaltSync(10);
      const encryptedPassword = bcrypt.hashSync(password, salt);
      const createdUser = await prisma.user.create({
        data: {
          ...data,
          password: encryptedPassword,
        },
      });
      return { error: false, data: createdUser };
    } catch (error: unknown) {
      return { error: true, data: normalizeError(error) };
    }
  }

  static async getAll() {
    try {
      const users = await prisma.user.findMany({ include: { Task: true } });
      return { error: false, data: users };
    } catch (error: unknown) {
      return { error: true, data: normalizeError(error) };
    }
  }

  static async getUserByEmail(data: string) {
    try {
      const email = data;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new CustomError("El usuario no existe.", 404);
      const { password, ...rest } = user;
      return { error: false, data: rest };
    } catch (error: unknown) {
      return { error: true, data: normalizeError(error) };
    }
  }

  static async updateUser(data: UpdateUser) {
    try {
      const { user, email } = data;
      await checkUserExists(email);
      const { password, ...rest } = await prisma.user.update({
        where: { email },
        data: user,
      });
      return { error: false, data: rest };
    } catch (error: unknown) {
      return { error: true, data: normalizeError(error) };
    }
  }

  static async updatePassword(data: UpdatePassword) {
    try {
      const { email, passwords } = data;
      const { currentPassword, newPassword } = passwords;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new CustomError("El usuario no existe.", 404);
      const isValid = bcrypt.compareSync(currentPassword, user.password);
      if (!isValid) throw new CustomError("Contraseña actual incorrecta", 401);
      const salt = bcrypt.genSaltSync(10);
      const encryptedPassword = bcrypt.hashSync(newPassword, salt);
      const { password, ...rest } = await prisma.user.update({
        where: { email },
        data: { password: encryptedPassword },
      });
      return { error: false, data: rest };
    } catch (error) {
      return { error: true, data: normalizeError(error) };
    }
  }

  static async deleteUser(data: string) {
    try {
      const id = data;
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) throw new CustomError("El usuario no existe.", 404);
      const deletedUser = await prisma.user.delete({ where: { id } });
      return {
        error: false,
        data: { message: "Usuario eliminado exitosamente." },
      };
    } catch (error) {
      return { error: true, data: normalizeError(error) };
    }
  }
}

export default UserService;
