const mockCloudinary = {
  uploader: {
    upload_large: jest.fn()
  },
  url: jest.fn(),
  config: jest.fn(), // <- must be here
};

export default mockCloudinary;
