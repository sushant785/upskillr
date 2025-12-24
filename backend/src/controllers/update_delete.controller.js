import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import Lesson from "../models/Lesson.model.js";
import s3 from "../config/s3.js";

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
