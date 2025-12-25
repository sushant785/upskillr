import { PutObjectCommand,DeleteObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Lesson from "../models/Lesson.model.js";
import s3 from "../config/s3.js";
import crypto from "crypto";
import mongoose from "mongoose";

export const Update_video_upload = async (req, res) => {
  try {
    const { videoId, fileType } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid lesson ID" });
    }

    if (!fileType) {
      return res.status(400).json({ message: "fileType is required" });
    }

    const lesson = await Lesson.findById(videoId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const fileExtension = fileType.split("/")[1];
    const newFileKey = `videos/${crypto.randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: newFileKey,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 1000,
    });

    res.status(200).json({
      uploadUrl,
      newFileKey,
      oldFileKey: lesson.videoUrl, // needed for step 2
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate upload URL" });
  }
};

export const Update_video_delete = async (req, res) => {
  try {
    const { videoId, newFileKey, oldFileKey } = req.body;

    
    const result = await Lesson.updateOne(
      { _id: videoId },
      { $set: { videoUrl: newFileKey } }
    );

    
    if (oldFileKey) {
      const delCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: oldFileKey,
      });
      await s3.send(delCommand);
    }

    res.status(200).json({ message: "Video updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

