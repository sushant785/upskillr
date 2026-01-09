import express from "express"
import { createCourse,getMyCourses,updateCourse,togglePublishCourse,deleteCourse,getInstructorDashboard,getCourseEnrollments, getCourseDetails, getCourseCurriculum } from "../controllers/instructor.controller.js"
import { isInstructor, protect } from "../middlewares/auth.middleware.js";
import {uploadThumbnail} from "../middlewares/upload.middleware.js"
import { createSection,deleteSection,reorderLessons } from "../controllers/section.controller.js";

const router = express.Router();

router.post("/courses",protect,isInstructor,uploadThumbnail.single("thumbnail"),createCourse)
router.get("/my-courses",protect,isInstructor,getMyCourses);
router.put("/courses/:id",protect,isInstructor,uploadThumbnail.single("thumbnail"),updateCourse);
router.patch("/courses/:id/publish",protect,isInstructor,togglePublishCourse);
router.delete("/courses/:id",protect,isInstructor,deleteCourse);
router.get("/courses/:id", protect, getCourseDetails);
router.get("/dashboard",protect,isInstructor,getInstructorDashboard);
router.get("/enrollments",protect,isInstructor,getCourseEnrollments);
router.get('/courses/:id/curriculum', protect, getCourseCurriculum);

router.post('/courses/:courseId/sections', protect, isInstructor, createSection);
router.delete('/courses/:courseId/sections/:sectionId', protect, isInstructor, deleteSection);
router.put('/courses/:courseId/sections/:sectionId/reorder-lessons', protect,isInstructor,reorderLessons);


export default router;