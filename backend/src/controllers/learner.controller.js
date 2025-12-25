import Course from "../models/Course.model.js";
import Enrollment from "../models/Enrollment.model.js";
import Lesson from "../models/Lesson.model.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";


export const getAllCourses = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = { isPublished: true };

        if (category && category !== "All") {
            query.category = category;
        }
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        const courses = await Course.find(query).populate("instructor", "name");
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getMyEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user._id; 

        
        const enrollments = await Enrollment.find({ user: userId })
            .populate({
                path: 'course',
                select: 'title description thumbnail instructor price',
                populate: { path: 'instructor', select: 'name' } 
            })
            .sort({ createdAt: -1 });

       
        const myCourses = enrollments.map(e => e.course);

        res.status(200).json({
            count: myCourses.length,
            courses: myCourses
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const enrollInCourse = async (req, res) => {
    try {
        const enrollment = await Enrollment.create({
            user: req.user._id,
            course: req.body.courseId
        });
        res.status(201).json({ message: "Enrolled successfully", enrollment });
    } catch (err) {
        res.status(400).json({ message: "You are already enrolled or invalid course" });
    }
};


export const getCourseDetails = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate("instructor", "name");
        if (!course) return res.status(404).json({ message: "Course not found" });
        
        const isEnrolled = await Enrollment.findOne({ 
            user: req.user._id, 
            course: req.params.courseId 
        });

        const lessons = await Lesson.find({ course: course._id }).select("title order").sort("order");
        
        res.status(200).json({ course, lessons, isEnrolled: !!isEnrolled });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getCourseLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({ course: req.params.courseId }).sort("order");
        
        
        const playableLessons = await Promise.all(lessons.map(async (lesson) => {
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: lesson.videoUrl, 
            });

            const playableUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
            
            return { ...lesson._doc, videoUrl: playableUrl };
        }));

        res.status(200).json(playableLessons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};