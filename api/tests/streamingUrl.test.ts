import mockPrisma from './mocks/prisma';
import mockCloudinary from './mocks/cloudinary';
import { getStreamingUrl } from '../src/services/streamingServices/streamingService';


jest.mock('../src/utils/config/database', () => mockPrisma)
jest.mock('cloudinary', () => ({v2:mockCloudinary}))


describe('getStreamingUrl', () => {
  const fileId = 'file-772';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and streaming URL if file is safe', async () => {
    mockPrisma.uploadedFiles.findUnique.mockResolvedValue({
      id: fileId,
      publicId: 'cloudinary-public-id',
      resourceType: 'video',
      status: 'SAFE'
    });

    mockCloudinary.url.mockReturnValue('https://mocked-streaming-url.com');

    const streamResponse = await getStreamingUrl(fileId);

    expect(streamResponse.code).toBe(200);
    expect(streamResponse.success).toBe(true);
    expect(streamResponse.streamUrl).toBe('https://mocked-streaming-url.com');
    expect(mockCloudinary.url).toHaveBeenCalledWith('cloudinary-public-id', expect.objectContaining({
      resource_type: 'video',
      secure: true,
      sign_url: true,
      format: 'mp4',
      transformation: expect.any(Array)
    }));
  });

  it('should return 404 if file is not found', async () => {
    mockPrisma.uploadedFiles.findUnique.mockResolvedValue(null);

    const noStreaming = await getStreamingUrl(fileId);

    expect(noStreaming.code).toBe(404);
    expect(noStreaming.success).toBe(false);
    expect(noStreaming.message).toBe('File not found or marked as unsafe');
  });

  it('should return 404 if file is marked as UNSAFE', async () => {
    mockPrisma.uploadedFiles.findUnique.mockResolvedValue({
      id: fileId,
      status: 'UNSAFE'
    });

    const dontStream = await getStreamingUrl(fileId);

    expect(dontStream.code).toBe(404);
    expect(dontStream.success).toBe(false);
    expect(dontStream.message).toBe('File not found or marked as unsafe');
  });
});