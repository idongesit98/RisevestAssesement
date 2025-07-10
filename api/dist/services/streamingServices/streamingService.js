"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreamingUrl = void 0;
const database_1 = __importDefault(require("../../utils/config/database"));
const cloudinary_1 = __importDefault(require("../../utils/config/cloudinary"));
const getStreamingUrl = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield database_1.default.uploadedFiles.findUnique({
        where: { id: fileId },
    });
    if (!file || file.status === 'UNSAFE') {
        return {
            code: 404,
            success: false,
            message: "File not found or marked as unsafe",
            data: null
        };
    }
    const url = cloudinary_1.default.url(file.publicId, {
        resource_type: file.resourceType,
        secure: true,
        sign_url: true,
        format: "mp4",
        transformation: [
            {
                quality: "auto",
                fetch_format: "auto"
            },
        ],
    });
    return {
        code: 200,
        success: true,
        streamUrl: url
    };
});
exports.getStreamingUrl = getStreamingUrl;
