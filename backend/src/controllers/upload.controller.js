import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";
import crypto from "crypto";
import Lesson from '../models/Lesson.model.js'

export const generateUploadUrl = async (req, res) => {
  try {
    const { course , title , order , fileType } = req.body;

    if (!fileType) {
      return res.status(400).json({ message: "fileType is required" });
    }

    const fileExtension = fileType.split("/")[1];

    const fileKey = `videos/${crypto.randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 300
    });

    
     const lesson = await Lesson.create({course , title , videoUrl:fileKey , order });
     console.log(lesson)
     let lesson_order = lesson.order
     
     res.status(200).json({
      uploadUrl,
      fileKey,
      lesson_order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate upload URL" });
  }
};
