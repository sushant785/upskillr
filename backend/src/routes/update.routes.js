import express from "express";
import { Update_video_upload ,Update_video_delete} from "../controllers/update.controller.js"
import {deleteVideo} from '../controllers/delete.controller.js'


const updateRouter = express.Router();

updateRouter.post("/update-upload",Update_video_upload);
updateRouter.post('/update-delete',Update_video_delete)
updateRouter.delete("/videos/:videoId", deleteVideo);

export default updateRouter;
