import mockPrisma from './mocks/prisma';
import { getFileHistory } from '../src/services/fileHistory/fileHistoryService';

jest.mock('../src/utils/config/database', () => mockPrisma)

describe('getFileHistory', () => {
  const fileId = 'file-id-123';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and history data if the history exists', async () => {
    const mockHistory = [
      { id: '1', action: 'upload', fileId, timeStamp: new Date() }
    ];

    mockPrisma.fileHistory.findMany.mockResolvedValue(mockHistory);

    const res = await getFileHistory(fileId);

    expect(res.code).toBe(200);
    expect(res.success).toBe(true);
    expect(res.data?.getHistory).toEqual(mockHistory);
    expect(mockPrisma.fileHistory.findMany).toHaveBeenCalledWith({
      where: { fileId },
      orderBy: { timeStamp: 'desc' }
    });
  });

  it('should return 404 if no history is found', async () => {
    mockPrisma.fileHistory.findMany.mockResolvedValue([]);

    const res = await getFileHistory(fileId);

    expect(res.code).toBe(404);
    expect(res.success).toBe(false);
    expect(res.message).toBe('No history present');
  });

  it('should return 500 if prismaDB has an error', async () => {
    mockPrisma.fileHistory.findMany.mockRejectedValue(new Error('Database Error'));

    const res = await getFileHistory(fileId);

    expect(res.code).toBe(500);
    expect(res.success).toBe(false);
    expect(res.message).toBe('Database Error');
  });
});
