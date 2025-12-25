import express from "express";
import { generateUploadUrl } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/video-upload-url",generateUploadUrl);

export default router;
