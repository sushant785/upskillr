import express from "express";
import { getReview,postReview} from "../controllers/reviews.controller.js"


const reviewRouter = express.Router();

reviewRouter.post("/post-review",postReview);
reviewRouter.get('/course/:course/reviews', getReview)

export default reviewRouter;
