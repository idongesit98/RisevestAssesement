"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockCloudinary = {
    uploader: {
        upload_large: jest.fn()
    },
    url: jest.fn(),
    config: jest.fn(), // <- must be here
};
exports.default = mockCloudinary;
