import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import Lesson from "../models/Lesson.model.js";
import s3 from "../config/s3.js";

export const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      return res.status(400).json({
        message: "videoId and fileKey are required",
      });
    }

    const lesson = await Lesson.findById(videoId);
    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }
    let fileKey = lesson.videoUrl

    
    const delCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    });

    await s3.send(delCommand);

    const result = await Lesson.deleteOne({ _id: videoId });

    console.log("DB delete result:", result);

    return res.status(200).json({
      message: "Video deleted successfully",
    });

  } catch (err) {
    console.error("Delete video error:", err);
    return res.status(500).json({
      message: "Deletion failed",
      error: err.message,
    });
  }
};
