import prisma from "../prisma";

async function clearDatabase() {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
}

export default clearDatabase;
