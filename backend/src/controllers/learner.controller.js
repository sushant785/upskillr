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
            if (!enrollment.course) return null; 

            const progressDoc = await Progress.findOne({ 
                user: userId, 
                course: enrollment.course._id 
            });

            const percent = progressDoc ? progressDoc.progressPercent : 0;

            return {
                ...enrollment._doc, 
                progressPercent: percent,
                status: percent === 100 ? 'completed' : 'in-progress',
                lastAccessedLesson: progressDoc ? progressDoc.lastAccessedLesson : null
            };
        }));
        const finalCourses = coursesWithProgress.filter(c => c !== null);

        res.status(200).json({
            count: finalCourses.length,
            courses: finalCourses
        });
    } catch (err) {
        console.error("Error fetching enrolled courses:", err);
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

        await Course.findByIdAndUpdate(courseId, {
          $inc: {studentCount:1}
        })

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

    const userProgress = await Progress.findOne({ user: userId, course: courseId });

  
    for (let section of course.sections) {
      for (let lesson of section.lessons) {
        if (lesson.videoUrl) {
          const command = new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: lesson.videoUrl });
          lesson.videoUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        }
        if (lesson.attachment) {
          const attachCmd = new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: lesson.attachment });
          lesson.attachment = await getSignedUrl(s3, attachCmd, { expiresIn: 3600 });
        }
      }
    }

    res.status(200).json({ 
      course, 
      completedLessons: userProgress ? userProgress.completedLessons : [],
      progressPercent: userProgress ? userProgress.progressPercent : 0 
    });
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
      progress = new Progress({ user: userId, course: courseId, completedLessons: [] });
    }

    
    const index = progress.completedLessons.indexOf(lessonId);
    if (index > -1) {
      progress.completedLessons.splice(index, 1);
    } else {
      progress.completedLessons.push(lessonId);
    }

    
    const lessonsCount = await Lesson.countDocuments({ course: courseId });
    progress.progressPercent = lessonsCount > 0 ? Math.round((progress.completedLessons.length / lessonsCount) * 100) : 0;
    progress.isCompleted = progress.progressPercent === 100;
    await progress.save();

    
    await Enrollment.findOneAndUpdate(
      { user: userId, course: courseId },
      { status: progress.progressPercent === 100 ? "completed" : "in-progress" }
    );

    res.status(200).json({ completedLessons: progress.completedLessons, progressPercent: progress.progressPercent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const getLearnerDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    
    const enrolledCoursesCount = await Enrollment.countDocuments({ user: userId });

    
    const allProgress = await Progress.find({ user: userId }).populate("course", "title thumbnail");

    
    const completedCourses = allProgress.filter(p => p.progressPercent === 100);
    const ongoingCourses = allProgress.filter(p => p.progressPercent < 100);

    
    const continueLearning = ongoingCourses
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 3);

    res.status(200).json({
      role: "learner",
      enrolledCourses: enrolledCoursesCount,
      ongoingCourses: ongoingCourses.length,
      completedCourses: completedCourses.length,
      continueLearning: continueLearning.map((p) => ({
        courseId: p.course?._id,
        title: p.course?.title,
        thumbnail: p.course?.thumbnail,
        progressPercent: p.progressPercent,
        lastAccessedLesson: p.lastAccessedLesson
      }))
    });

  } catch (error) {
    console.error("Learner dashboard error:", error);
    res.status(500).json({ message: "Failed to fetch learner dashboard" });
  }
};


export const updateLastAccessed = async (req,res) => {
  try {
    const {courseId , lessonId} = req.body;
    const userId = req.user._id;

    if(!courseId || !lessonId) {
      return res.status(404).json({message:"course and lesson id are required"});
    }

    const updatedProgress = await Progress.findOneAndUpdate(
      {user:userId,course:courseId},
      {$set: {lastAccessedLesson: lessonId}},
      {upsert:true , new:true}
    )
    
    if (!updatedProgress) {
      return res.status(404).json({ message: "Progress record not found. Is user enrolled?" });
    }

    res.status(200).json({ message: "Progress marker updated" });
  }
  catch(err) {
    console.error(err);
    res.status(500).json({message : "Failed to update marker"})
  }
}