import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },

    comment: {
      type: String
    }
  },
  { timestamps: true }
);

// One review per user per course
reviewSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
