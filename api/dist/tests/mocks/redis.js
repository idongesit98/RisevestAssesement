"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockRedis = {
    get: jest.fn(),
    setEx: jest.fn(),
    connect: jest.fn(), // optional if used directly
    on: jest.fn(), // mocks redisClient.on(...)
};
exports.default = mockRedis;
