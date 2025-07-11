"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
prisma.$connect()
    .then(() => prisma.$executeRaw `SELECT 1`)
    .then(() => console.log('DB connected'))
    .catch(console.error);
exports.default = prisma;
