import express from "express";
import {uploadFile, downloadFileFromCloud, getAll, markedFile } from "../../controllers/fileController";
import {upload } from "../../utils/config/cloudinary";
import passport from "passport";
import { isAdmin } from "../../middlewares/adminMiddleware";

const router = express.Router();

router.get("/all",passport.authenticate("jwt",{session:false}),getAll)
router.get("/download/:publicId",passport.authenticate("jwt", { session: false }),downloadFileFromCloud)
router.post("/upload", passport.authenticate("jwt", { session: false }),isAdmin,upload.single("file"),uploadFile)
router.put("/unsafe/:fileId",passport.authenticate("jwt", { session: false }),markedFile)


export default router;