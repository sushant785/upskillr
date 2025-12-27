import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";
import crypto from "crypto";
import Lesson from '../models/Lesson.model.js'
import Section from "../models/Section.model.js"

export const generateUploadUrl = async (req, res) => {
  try {
    const { course , title , order , fileTypeMain , fileTypeResource, sectionId } = req.body;

    if (!fileTypeMain || !fileTypeResource ) {
      return res.status(400).json({ message: "fileType is required" });
    }

    if (!sectionId) {
      return res.status(400).json({ message: "sectionId is required" });
    }

    const fileExtensionMain = fileTypeMain.split("/")[1]; 
    const fileExtensionResource = fileTypeResource.split("/")[1]; 

    const fileKeyMain = `videos/${crypto.randomUUID()}.${fileExtensionMain}`;
    const fileKeyResource = `attachment/${crypto.randomUUID()}.${fileExtensionResource}`;


    const commandMain = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKeyMain,
      ContentType: fileTypeMain
    });

    const uploadUrlMain = await getSignedUrl(s3, commandMain, {
      expiresIn: 1000
    });

    const commandResource = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKeyResource
    });

    const uploadUrlResource = await getSignedUrl(s3, commandResource, {
      expiresIn: 300
    });
    


    
     const lesson = await Lesson.create({course , title , videoUrl:fileKeyMain , attachment: fileKeyResource ,order,section: sectionId});
     console.log(lesson)

     await Section.findByIdAndUpdate(sectionId, {
        $push: { lessons: lesson._id }
      });


     let lesson_order = lesson.order
     
     res.status(200).json({
      uploadUrlMain,
      fileKeyMain,
      uploadUrlResource,
      fileKeyResource,
      lesson_order,
      lessonId: lesson._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate upload URL" });
  }
};
