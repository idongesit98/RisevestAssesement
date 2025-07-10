import mockPrisma from './mocks/prisma';
import { createFolder,getFolderById,listRootFolders,moveFileToFolder } from '../src/services/folderServices/folderServices';

jest.mock('../src/utils/config/database', () => mockPrisma);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createFolder', () => {
     describe('createFolder', () => {
    it('should return 400 if folder already exists', async () => {
      mockPrisma.folder.findUnique.mockResolvedValue({ id: 'existing-id' });

      const createResponse = await createFolder('Test', 'user-id', 'folder-id');

      expect(createResponse.code).toBe(400);
      expect(createResponse.message).toBe('User already exist');
    });

    it('should create and return a new folder', async () => {
      mockPrisma.folder.findUnique.mockResolvedValue(null);
      mockPrisma.folder.create.mockResolvedValue({ id: 'new-folder-id', name: 'Test' });

      const newResponse = await createFolder('Test', 'user-id', 'folder-id');

      expect(newResponse.code).toBe(201);
      expect(newResponse.message).toBe('Folder created successfully');
      expect(newResponse.data?.newFolder.id).toBe('new-folder-id');
    });
  });

  describe('getFolderById', () => {
    it('should return 404 if folder is not found', async () => {
      mockPrisma.folder.findUnique.mockResolvedValue(null);

      const getResponse = await getFolderById('folder-id');

      expect(getResponse.code).toBe(404);
      expect(getResponse.message).toBe('Folder not found');
    });

    it('should return folder data if found', async () => {
      mockPrisma.folder.findUnique.mockResolvedValue({ id: 'folder-id', subfolders: [], uploads: [] });

      const foundResponse = await getFolderById('folder-id');

      expect(foundResponse.code).toBe(200);
      expect(foundResponse.data?.getFolderById.id).toBe('folder-id');
    });
  });

  describe('listRootFolders', () => {
    it('should return 200 with folders', async () => {
      mockPrisma.folder.findMany.mockResolvedValue([{ id: 'folder-1' }]);

      const listResponse = await listRootFolders('user-id');

      expect(listResponse.code).toBe(200);
      expect(listResponse.data?.getAllFolders.length).toBe(1);
    });

    it('should return 404 if no folders found', async () => {
      mockPrisma.folder.findMany.mockResolvedValue([]);

      const notFoundResponse = await listRootFolders('user-id');

      expect(notFoundResponse.code).toBe(404);
    });
  });

  describe('moveFileToFolder', () => {
    it('should return 400 if any param is missing', async () => {
      const moveResponse = await moveFileToFolder('', 'folderId', 'userId');
      expect(moveResponse.code).toBe(400);
    });

    it('should move file and return updatedFile', async () => {
      mockPrisma.uploadedFiles.update.mockResolvedValue({ id: 'file-id', folderId: 'folder-id' });
      mockPrisma.fileHistory.create.mockResolvedValue({});

      const updateResponse = await moveFileToFolder('file-id', 'folder-id', 'user-id');

      expect(updateResponse.code).toBe(200);
      expect(updateResponse.message).toBe('File moved successfully');
      expect(updateResponse.data?.updatedFile.folderId).toBe('folder-id');
    });
  });
})