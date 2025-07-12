import express from "express";
import { fileHistory } from "../../controllers/fileHistoryController";
import { authenticate } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/file-history/:fileId",authenticate,fileHistory)

export default router;