import express from "express";
import {uploadFile, downloadFileFromCloud, getAll, markedFile } from "../../controllers/fileController";
import {upload } from "../../utils/config/cloudinary";
import { authenticate } from "../../middlewares/authMiddleware";

import { isAdmin } from "../../middlewares/adminMiddleware";

const router = express.Router();

router.get("/all",getAll)
router.get("/download/:publicId",authenticate,downloadFileFromCloud)
router.post("/upload",authenticate,isAdmin,upload.single("file"),uploadFile)
router.put("/unsafe/:fileId",authenticate,markedFile)


export default router;
