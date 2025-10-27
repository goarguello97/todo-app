import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import CustomError from "../helpers/CustomError";
import { execute } from "../helpers/execute";
import { Auth } from "../interface/auth.interface";
import prisma from "../prisma";

class AuthService {
  static async login(data: Auth) {
    return execute(async () => {
      const { email, password } = data;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user)
        throw new CustomError("Usuario o contraseña incorrectos.", 401);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        throw new CustomError("Usuario o contraseña incorrectos.", 401);

      const secret = process.env.JWT_SECRET!;
      if (!secret) throw new CustomError("JWT no definido", 404);
      const payload = { id: user.id, email: user.email };
      const options: SignOptions = {
        expiresIn: "1h",
      };

      const token = jwt.sign(payload, secret, options);
      const userResponse = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          Task: true,
        },
      });
      return { user: userResponse, token };
    });
  }

  static async me(id: string) {
    return execute(async () => {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          Task: true,
        },
      });
      return { user };
    });
  }
}

export default AuthService;
