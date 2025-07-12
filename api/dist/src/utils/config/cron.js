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
const node_cron_1 = __importDefault(require("node-cron"));
const database_1 = __importDefault(require("./database"));
const cloudinary_1 = __importDefault(require("./cloudinary"));
const deleteUnSafeFile = () => __awaiter(void 0, void 0, void 0, function* () {
    const unSafeFiles = yield database_1.default.uploadedFiles.findMany({
        where: { status: "UNSAFE" },
    });
    console.log(`Found ${unSafeFiles.length} unsafe files.`);
    for (const file of unSafeFiles) {
        try {
            const result = yield cloudinary_1.default.uploader.destroy(file.publicId, { resource_type: file.resourceType });
            if (result.result === "ok" || result.result === "not found") {
                yield database_1.default.fileHistory.deleteMany({ where: { fileId: file.id } });
                yield database_1.default.uploadedFiles.delete({ where: { id: file.id }, });
                console.log(`Deleted unsafe file: ${file.filename}`);
            }
            else {
                console.warn(`Could not delete from Cloudinary: ${file.filename}`, result);
            }
        }
        catch (error) {
            console.error(`Failed to delete ${file.filename}:`, error);
        }
    }
});
node_cron_1.default.schedule('*/10 * * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running unsafe file deletion every 10minutes............");
    yield deleteUnSafeFile();
}));
