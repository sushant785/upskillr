import express from "express";
import { getReview,postReview} from "../controllers/reviews.controller.js"


const reviewRouter = express.Router();

reviewRouter.post("/post-review",postReview);
reviewRouter.get('/get-review/:course',getReview)

export default reviewRouter;
