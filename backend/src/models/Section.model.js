import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course",
    required: true
  },
  // We store lesson IDs here to keep them ordered
  lessons: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Lesson" 
  }],
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("Section", sectionSchema);