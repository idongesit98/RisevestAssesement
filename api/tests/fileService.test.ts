import mockPrisma from './mocks/prisma';
import mockCloudinary from './mocks/cloudinary';
import mockRedis from './mocks/redis';
import { uploadFileToCloudinary,saveFileRecordToDB,generateCloudinaryDownloadUrl,getAllUploads,markFileUnsafe } from '../src/services/fileServices/fileServices';

jest.mock('../src/utils/config/database', () => mockPrisma)
jest.mock('cloudinary', () => ({v2:mockCloudinary}))
jest.mock('../src/utils/config/redis', () =>({
    redisClient:mockRedis
}))

beforeEach(() => {
  jest.clearAllMocks();
});

describe('uploadFileToCloudinary', () => {
  it('should upload and return success,if successful', async () => {
    mockCloudinary.uploader.upload_large.mockResolvedValue({
      public_id: 'file123',
      resource_type: 'image',
      format: 'jpg',
      secure_url: 'https://cdn.cloudinary.com/file.jpg',
      bytes: 98213
    });

    const uploadResponse = await uploadFileToCloudinary('fake/path/file.jpg');
    expect(uploadResponse.success).toBe(true);
    expect(uploadResponse.data?.publicId).toBe('file123');
  });

  it('should return an error if upload fails', async () => {
    mockCloudinary.uploader.upload_large.mockRejectedValue(new Error('Upload failed'));

    const uploadErrorResponse = await uploadFileToCloudinary('bad/file');
    expect(uploadErrorResponse.success).toBe(false);
    expect(uploadErrorResponse.message).toBe('Upload failed');
  });
});

describe('saveFileRecordToDB', () => {
  it('should call prisma.uploadedFiles.create', async () => {
    mockPrisma.uploadedFiles.create.mockResolvedValue({ id: 'file-id' });

    const file = await saveFileRecordToDB({
      filename: 'file.jpg',
      key: 'file123',
      size: 3421,
      url: 'https://cdn.cloudinary.com/file.jpg',
      publicId: 'pub3290',
      resourceType: 'image',
      userId: 'user-id',
      folderId: 'folder-id'
    });

    expect(file.id).toBe('file-id');
    expect(mockPrisma.uploadedFiles.create).toHaveBeenCalled();
  });
});

describe('generateCloudinaryDownloadUrl', () => {
  it('should return cached URL', async () => {
    mockRedis.get.mockResolvedValue('https://cached-url.com');

    const generateResponse = await generateCloudinaryDownloadUrl('publicId', 'image');
    expect(generateResponse.fromCache).toBe(true);
    expect(generateResponse.url).toBe('https://cached-url.com');
  });

  it('should generate and cache new signed URL', async () => {
    mockRedis.get.mockResolvedValue(null);
    mockCloudinary.url.mockReturnValue('https://signed-url.com');
    mockRedis.setEx.mockResolvedValue('OK');

    const cacheResponse = await generateCloudinaryDownloadUrl('publicId', 'image');
    expect(cacheResponse.url).toBe('https://signed-url.com');
    expect(cacheResponse.fromCache).toBe(false);
  });
});

describe('getAllUploads', () => {
  it('should return 404 if no file found', async () => {
    mockPrisma.uploadedFiles.findMany.mockResolvedValue([]);

    const allResponse = await getAllUploads();
    expect(allResponse.code).toBe(404);
  });

  it('should return all uploads if available', async () => {
    mockPrisma.uploadedFiles.findMany.mockResolvedValue([{ id: 'file1' }]);

    const availableResponse = await getAllUploads();
    expect(availableResponse.code).toBe(200);
    expect(availableResponse.data?.allUploads.length).toBe(1);
  });
});

describe('markFileUnsafe', () => {
  it('should return 404 if fileId is missing', async () => {
    const unsafeResponse = await markFileUnsafe('', 'reason', 'user-id');
    expect(unsafeResponse.code).toBe(404);
  });

  it('should return 400 if reason is missing', async () => {
    const missingResponse = await markFileUnsafe('file-id', '', 'user-id');
    expect(missingResponse.code).toBe(400);
  });

  it('should mark file as unsafe and add history to database', async () => {
    mockPrisma.uploadedFiles.update.mockResolvedValue({ id: 'file-id', status: 'UNSAFE' });
    mockPrisma.fileHistory.create.mockResolvedValue({});

    const historyResponse = await markFileUnsafe('file-id', 'malware found', 'user-id');

    expect(historyResponse.code).toBe(200);
    expect(historyResponse.data?.Unsafe.status).toBe('UNSAFE');
    expect(mockPrisma.fileHistory.create).toHaveBeenCalled();
  });
});
