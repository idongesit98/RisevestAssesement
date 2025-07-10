const mockRedis = {
  get: jest.fn(),
  setEx: jest.fn(),
  connect: jest.fn(), // optional if used directly
  on: jest.fn(),       // mocks redisClient.on(...)
};

export default mockRedis;
