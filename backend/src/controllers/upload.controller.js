import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";
import crypto from "crypto";

export const generateUploadUrl = async (req, res) => {
  try {
    const { fileType } = req.body;

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

    res.status(200).json({
      uploadUrl,
      fileKey
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate upload URL" });
  }
};
