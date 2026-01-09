import Review from '../models/Review.model.js'
import mongoose from "mongoose";
import CourseModel from "../models/Course.model.js";


export const postReview = async (req, res) => {
  const { user, course, rating, comment } = req.body;

  if (!user || !course || !rating) {
    return res.status(400).json({
      message: "user, course and rating are required",
    });
  }

  try {
    // 1️⃣ Create review
    const review = await Review.create({
      user,
      course,
      rating,
      comment,
    });

    // 2️⃣ Get current course data
    const courseDoc = await CourseModel.findById(course).select(
      "averageRating totalReviews"
    );

    const oldTotal = courseDoc.totalReviews || 0;
    const oldAvg = courseDoc.averageRating || 0;

    // 3️⃣ Calculate new average
    const newTotal = oldTotal + 1;
    const newAvg =
      ((oldAvg * oldTotal) + rating) / newTotal;

    // 4️⃣ Update course
    await CourseModel.updateOne(
      { _id: course },
      {
        $set: {
          averageRating: Number(newAvg.toFixed(1)),
        },
        $inc: {
          totalReviews: 1,
        },
      }
    );

    return res.status(200).json({
      message: "Review saved successfully",
      review,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Cannot submit review",
    });
  }
};


export const getReview = async (req,res) =>{
    console.log("HIT getReview API");
    console.log("params:", req.params);

    let {course} = req.params
    try{

      const reviewsList = await Review.find({ course: course })
            .populate('user', 'name') // Connects to User model to get the name
            .sort({ createdAt: -1 });




        let reviews = await Review.aggregate([
            {
                $match:{course:new mongoose.Types.ObjectId(course)}
            },
            {
                $group:{
                    _id:'$course',
                    avgRating:{$avg:'$rating'},
                    totalReviews:{$sum:1}
                }
            }
        ])
        let avgRating = reviews[0]?.avgRating
        let totalReviews = reviews[0]?.totalReviews
        console.log(reviews)

        return res.status(200).json({
            avgRating,
            totalReviews,
            reviews: reviewsList
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            "message":"Failed to fetch reviews"
        })
    }
}