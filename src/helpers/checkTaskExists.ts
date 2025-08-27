import prisma from "../prisma";
import CustomError from "./CustomError";

const checkTaskExists = async (id: string) => {
  if (!id) throw new CustomError("El id es necesario.", 404);
  const task = prisma.task.findUnique({ where: { id } });
  if (!task) throw new CustomError("La tarea no existe.", 404);
};

export default checkTaskExists;
