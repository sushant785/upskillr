import Course from "../models/Course.model.js";
import Enrollment from "../models/Enrollment.model.js";
import Lesson from "../models/Lesson.model.js";
import Progress from "../models/Progress.model.js"
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
        res.status(200).json({ 
            count: courses.length,
            courses: courses 
        });
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

            const coursesWithProgress = await Promise.all(enrollments.map(async (enrollment) => {
            const progressDoc = await Progress.findOne({ 
                user: userId, 
                course: enrollment.course?._id 
            });

            return {
                ...enrollment._doc, 
                progressPercent: progressDoc ? progressDoc.progressPercent : 0, 
                status: progressDoc?.isCompleted ? 'completed' : 'in-progress'
            };
        }));

        res.status(200).json({
            count: coursesWithProgress.length,
            courses: coursesWithProgress
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const enrollInCourse = async (req, res) => {
    try {
        const userId = req.user._id; 
        const courseId = req.body.courseId;

        const [existingEnrollment, existingProgress] = await Promise.all([
            Enrollment.findOne({ user: userId, course: courseId }),
            Progress.findOne({ user: userId, course: courseId })
        ]);
        
        if (existingEnrollment || existingProgress) {
            return res.status(400).json({ message: "You are already enrolled in this course"});
        }

        const enrollment = await Enrollment.create({
            user: userId,
            course: courseId,
            status: "in-progress"
        });

        await Progress.create({
            user: userId,
            course: courseId,
            progressPercent: 0,
            completedLessons: []
        });

        res.status(201).json({ message: "Enrolled successfully", enrollment });

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

export const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const course = await Course.findById(courseId)
            .populate("instructor", "name")
            .populate({
                path: "sections",
                options: { sort: { order: 1 } }, 
                populate: {
                    path: "lessons",
                    options: { sort: { order: 1 } }, 
                    select: "title videoUrl order resourceUrl attachment"
                }
            });

        if (!course) return res.status(404).json({ message: "Course not found" });

        for (let section of course.sections) {
        for (let lesson of section.lessons) {
        if (lesson.videoUrl) {
          const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: lesson.videoUrl, 
          });

          
          const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
          lesson.videoUrl = signedUrl; 
        }
        
        if (lesson.attachment) {
         const attachmentCommand = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: lesson.attachment, 
      });

      
      const signedAttachmentUrl = await getSignedUrl(s3, attachmentCommand, { expiresIn: 3600 });
      lesson.attachment = signedAttachmentUrl; 
    }
    }
    }

        const isEnrolled = await Enrollment.findOne({ user: userId, course: courseId });

        res.status(200).json({ course, isEnrolled: !!isEnrolled });
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


export const updateLessonProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const userId = req.user._id;

    
    let progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
      progress = await Progress.create({
        user: userId,
        course: courseId,
        completedLessons: [],
        progressPercent: 0
      });
    }

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      
     
      const totalLessons = await Lesson.countDocuments({ course: courseId });

      if (totalLessons > 0) {
        const completedCount = progress.completedLessons.length;
        progress.progressPercent = Math.round((completedCount / totalLessons) * 100);
      }

      
      if (progress.progressPercent === 100) {
        progress.isCompleted = true;
      }

      await progress.save();
    }

    res.status(200).json({
      message: "Progress updated successfully",
      progressPercent: progress.progressPercent,
      isCompleted: progress.isCompleted
    });
  } catch (error) {
    res.status(500).json({ message: "Server error updating progress", error: error.message });
  }
};



export const getLearnerDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const enrolledCourses = await Enrollment.countDocuments({ user: userId });
    const completedCourses = await Progress.countDocuments({
      user: userId,
      isCompleted: true
    });
    const ongoingCourses = enrolledCourses - completedCourses;

    const continueLearning = await Progress.find({
      user: userId,
      isCompleted: false
    })
      .sort({ updatedAt: -1 })
      .limit(3)
      .populate("course", "title thumbnail");

    res.status(200).json({
      role: "learner",
      enrolledCourses,
      ongoingCourses,
      completedCourses,
      continueLearning: continueLearning.map((p) => ({
        courseId: p.course._id,
        title: p.course.title,
        thumbnail: p.course.thumbnail,
        progressPercent: p.progressPercent
      }))
    });

  } catch (error) {
    console.error("Learner dashboard error:", error);
    res.status(500).json({ message: "Failed to fetch learner dashboard" });
  }
};
