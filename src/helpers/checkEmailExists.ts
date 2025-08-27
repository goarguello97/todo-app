import prisma from "../prisma";
import CustomError from "./CustomError";

const checkEmailExists = async (email: string) => {
  if (!email) throw new CustomError("El email es necesario.", 404);
  const searchEmail = await prisma.user.findUnique({ where: { email } });
  if (searchEmail) {
    throw new CustomError(`El email ${email} ya se encuentra en uso.`, 404);
  }
};

export default checkEmailExists;
