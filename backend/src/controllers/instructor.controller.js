import CourseModel from "../models/Course.model.js";
import LessonModel from "../models/Lesson.model.js"
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import crypto from "crypto";

const BUCKET = process.env.AWS_THUMBNAIL_BUCKET;

const uploadThumbnailToS3 = async (file) => {
    const ext = file.originalname.split(".").pop()
    const key = `thumbnails/${crypto.randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
        Bucket:BUCKET,
        Key:key,
        Body:file.buffer,
        ContentType: file.mimetype
    })

    await s3.send(command);
    return `https://${BUCKET}.s3.amazonaws.com/${key}`;
}

export const createCourse = async (req,res) => {
    try {
        console.log("USER:", req.user);

        const {title,description,category,price} = req.body;

        if(!title || !description || !category || !req.file) {
            return res.status(400).json({message:"All fields are required"})
        }

        const thumbnailUrl = await uploadThumbnailToS3(req.file)


        const course = await CourseModel.create({
            title,
            description,
            category,
            thumbnail:thumbnailUrl,
            price,
            instructor:req.user._id,
            isPublished:false
        })

        res.status(201).json({message:"course created success",course})

    }
    catch(err) {
        console.log(err)
        res.status(500).json({message:err.message})
    }
}

export const getMyCourses = async (req,res) => {
    try {
        const userId = req.user._id

        const myCourses = await CourseModel.find({
            instructor: userId
        }).sort({ createdAt:-1 })

        res.status(200).json({count:myCourses.length,courses:myCourses})
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const updateCourse = async (req ,res) => {
    try {
        const courseId = req.params.id;
        const course = await CourseModel.findById(courseId);

        if(!course) {
            return res.status(404).json({message:"Course not found"})
        }

        if(course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({message: "Not your Course"})
        }

        const allowedUpdates = [
            "title",
            "description",
            "category",
            "price"
        ];

        allowedUpdates.forEach((field) => {
            if(req.body[field] !== undefined){
                course[field] = req.body[field];
            }
        })

        if (req.file) {
            const newThumbnail = await uploadThumbnailToS3(req.file);
            course.thumbnail = newThumbnail;
        }

        await course.save();

        res.status(200).json({message:"course updated success"})
    }
    catch(err) {
        res.status(500).json({message:err.message})
    }
}

export const togglePublishCourse = async (req,res) => {
    try {

        const course = await CourseModel.findById(req.params.id);

        if(!course) {
            return res.status(404).json({message:"Course not found"})
        }

        if(course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({message: "Not your Course"})
        }

        course.isPublished = !course.isPublished;
        await course.save()

        return res.status(200).json({message:`Course ${course.isPublished ? "published" : "unpublished"} successfully`});
    }
    catch(err) {
        res.status(500).json({message:err.message})
    }
}


export const deleteCourse = async (req,res) => {
    try {
        const course = await CourseModel.findById(req.params.id)

        if(!course) {
            return res.status(404).json({message:"Course not found"})
        }

        if(course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({message:"Not your course"})
        }

        await LessonModel.deleteMany({ course:course._id})

        await course.deleteOne()
        res.status(200).json({message:"course and lessons deleted success"})

    }
    catch(err) {
        res.status(500).json({message:err.message})
    }
}