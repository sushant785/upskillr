import CourseModel from "../models/Course.model.js";
import LessonModel from "../models/Lesson.model.js";
import EnrollmentModel from "../models/Enrollment.model.js"
import ProgressModel from "../models/Progress.model.js"
import SectionModel from "../models/Section.model.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import crypto from "crypto";
import { inspect } from "util";

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
        await SectionModel.deleteMany({ course: course._id });

        await course.deleteOne()
        res.status(200).json({message:"course and lessons deleted success"})

    }
    catch(err) {
        res.status(500).json({message:err.message})
    }
}


export const getInstructorDashboard = async (req,res) => {
    try {

        const instructorId = req.user._id;

        const totalCourses = await CourseModel.countDocuments({
            instructor:instructorId,
        })

        const publishedCourses = await CourseModel.countDocuments({
            instructor: instructorId,
            isPublished:true
        })

        const draftCourses = await CourseModel.countDocuments({
            instructor:instructorId,
            isPublished:false
        })

        const courses = await CourseModel.find(
            {instructor:instructorId},
            "_id title isPublished  createdAt"
        );

        const courseIds = courses.map(course => course._id)


        const totalEnrollments = await EnrollmentModel.countDocuments({
            course: {$in:courseIds}
        });

        const activeLearners = await EnrollmentModel.countDocuments({
            course: {$in:courseIds},
            status: "in-progress"
        })

        const recentCourses = await CourseModel.find({
            instructor:instructorId
        })
        .sort({createdAt:-1})
        .limit(5)
        .select("title isPublished createdAt price")

        const recentEnrollments = await EnrollmentModel.find({
            course: { $in: courseIds }
        })
        .sort({createdAt: -1})
        .limit(5)
        .populate("user", "name")
        .populate("course", "title");



        res.status(200).json({
            totalCourses,
            publishedCourses,
            draftCourses,
            totalEnrollments,
            activeLearners,
            recentCourses,
            recentEnrollments: recentEnrollments.map(e => ({
                learner: e.user.name,
                course: e.course.title,
                enrolledAt: e.createdAt
            }))
        });

    }
    catch(err) {
        console.error("Instructor dashboard error:", err);
        res.status(500).json({message:"Failed to load instructor dashboard"})
    }
}

export const getCourseEnrollments = async (req, res) => {
    try {
        const instructorId = req.user._id;
        const { courseId } = req.params;

        const course = await CourseModel.findOne({
            _id: courseId,
            instructor: instructorId
        });

        if (!course) {
            return res.status(404).json({message: "Course not found or not authorized"});
        }

        const totalLessons = await LessonModel.countDocuments({
            course: courseId
        });

        const enrollments = await EnrollmentModel.find({ course: courseId })
        .populate("user", "name email")
        .sort({ createdAt: -1 });

        const progressRecords = await ProgressModel.find({ course: courseId });

        const progressMap = {};
        progressRecords.forEach(p => {
            progressMap[p.user.toString()] = p.completedLessons.length;
        });

        const learners = enrollments.map(e => {
            const completedLessons = progressMap[e.user._id.toString()] || 0;

            let progressPercent = 0;

            if (e.status === "completed") {
                progressPercent = 100;
            } else if (totalLessons > 0) {
                progressPercent = Math.round(
                (completedLessons / totalLessons) * 100
                );
            }

            return {
                learnerId: e.user._id,
                name: e.user.name,
                email: e.user.email,
                completedLessons,
                totalLessons,
                progress: progressPercent,
                status: e.status
            };
        });

        res.status(200).json({
            courseTitle: course.title,
            totalLearners: learners.length,
            learners
        });

    } catch (error) {
        console.error("Get course enrollments error:", error);
        res.status(500).json({message: "Failed to fetch course enrollments"});
    }
};

export const getCourseDetails = async (req,res) => {
    try {
        const courseId = req.params.id;

        const course = await CourseModel.findById(courseId)

        if(!course) {
            return res.status(404).json({message:"Course not found"})
        }
        
        if (req.user && course.instructor.toString() !== req.user._id.toString()) {
             return res.status(403).json({ message: "Unauthorized access" });
        }

        res.status(200).json({message:"Course details fetched success" , course})
        
    } catch(err) {
        console.log(err.message)
        res.status(500).json({message:"Error fetching course details"})
    }
}


export const getCourseCurriculum = async (req, res) => {
    try {
        const { id } = req.params; 

        const sections = await SectionModel.find({ course: id })
            .sort({ order: 1 }) 
            .populate({
                path: "lessons",
                options: { sort: { order: 1 } } // Sort lessons inside the module (Lesson 1, 2...)
            });

        res.status(200).json({ success: true, sections });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching curriculum" });
    }
};