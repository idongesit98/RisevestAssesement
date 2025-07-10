"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockPrisma = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn()
    },
    folder: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
    },
    uploadedFiles: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn()
    },
    fileHistory: {
        create: jest.fn(),
        findMany: jest.fn()
    }
};
exports.default = mockPrisma;
