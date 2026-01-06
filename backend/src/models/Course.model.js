import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    isPublished: {
      type: Boolean,
      default: false
    },

    thumbnail: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      default: 0,
      min:0
    },

    averageRating: {
      type: Number,
      default: 0
    },

    totalReviews:{
      type:Number,
      default : 0
    },

    studentCount: {
      type: Number,
      default:0
    },
    
    sections: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section"
    }],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
