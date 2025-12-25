import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
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

    progressPercent: {
      type: Number,
      default: 0
    },

    isCompleted: {
      type: Boolean,
      default: false
    },

    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
      }
    ]
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, course: 1 }, { unique: true });


export default mongoose.model("Progress", progressSchema);
