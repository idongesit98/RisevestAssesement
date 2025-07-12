import express from "express";
import { createFolderHandler, getFolder, listFolder, moveFile } from "../../controllers/folderController";
import { authenticate } from "../../middlewares/authMiddleware";


const router = express.Router();

router.get("/folders/:folderId",authenticate,getFolder);
router.get("/allfolders",authenticate,listFolder)
router.post("/create",authenticate,createFolderHandler)
router.put("/move",authenticate,moveFile)

export default router;