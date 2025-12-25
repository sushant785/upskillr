import express from "express"
import { createCourse,getMyCourses,updateCourse,togglePublishCourse,deleteCourse,getInstructorDashboard } from "../controllers/instructor.controller.js"
import { isInstructor, protect } from "../middlewares/auth.middleware.js";
import {uploadThumbnail} from "../middlewares/upload.middleware.js"

const router = express.Router();

router.post("/courses",protect,isInstructor,uploadThumbnail.single("thumbnail"),createCourse)
router.get("/my-courses",protect,isInstructor,getMyCourses);
router.put("/courses/:id",protect,isInstructor,uploadThumbnail.single("thumbnail"),updateCourse);
router.patch("/courses/:id/publish",protect,isInstructor,togglePublishCourse);
router.delete("/courses/:id",protect,isInstructor,deleteCourse);
router.get("/dashboard",protect,isInstructor,getInstructorDashboard);

export default router;