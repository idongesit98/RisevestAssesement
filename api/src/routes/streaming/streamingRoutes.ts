import express from "express";
import { streamFileHandler } from "../../controllers/streamingController";
import { authenticate } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/stream/:fileId",authenticate,streamFileHandler)

export default router;