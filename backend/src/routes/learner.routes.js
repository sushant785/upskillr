import express from "express";
import { getAllCourses, getMyEnrolledCourses, enrollInCourse, getCourseLessons, getCourseDetails,updateLessonProgress, getLearnerDashboard } from "../controllers/learner.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/browse", protect, getAllCourses);
router.get("/my-courses", protect, getMyEnrolledCourses);
router.post("/enroll", protect, enrollInCourse);
router.post("/update-progress", protect, updateLessonProgress);
router.get("/course/:courseId", protect, getCourseDetails);
router.get("/course/:courseId/lessons", protect, getCourseLessons);
router.get("/dashboard",protect,getLearnerDashboard);

export default router;