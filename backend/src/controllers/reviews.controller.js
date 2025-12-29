import Review from '../models/Review.model.js'
import mongoose from "mongoose";

export const postReview = async (req,res) => {
    const {user , course , rating, comment} = req.body 
    if (!user || !course || !rating) {
      return res.status(400).json({
        message: "user, course and rating are required"
      });
    }
    try{
        let review = await Review.create({user , course , rating , comment})
        console.log(review)
        return res.status(200).json({
            message: "Review saved successfully",
            review
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            "message":"Cannot submit review"
        })
    }
}

export const getReview = async (req,res) =>{
    console.log("HIT getReview API");
    console.log("params:", req.params);

    let {course} = req.params
    try{
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
            totalReviews
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            "message":"Failed to fetch reviews"
        })
    }
}