import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    videoUrl: {
      type: String
    },
    attachment: {
      type: String
    },

    resourceUrl: {
      type: String
    },

    order: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
