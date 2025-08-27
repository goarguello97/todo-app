import prisma from "../prisma";
import CustomError from "./CustomError";

const checkUserExists = async (email: string) => {
  if (!email) throw Error("El email es necesario.");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new CustomError("El usuario no existe", 404);
};

export default checkUserExists;
