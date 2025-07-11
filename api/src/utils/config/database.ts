import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

prisma.$connect()
  .then(() => prisma.$executeRaw`SELECT 1`)
  .then(() => console.log('DB connected'))
  .catch(console.error);

export default prisma