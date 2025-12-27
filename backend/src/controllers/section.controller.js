import Section from "../models/Section.model.js";
import Course from "../models/Course.model.js";
import Lesson from "../models/Lesson.model.js"


export const createSection = async (req, res) => {
  try {
    const { title, order } = req.body;
    const { courseId } = req.params; 

    const newSection = await Section.create({
      title,
      course: courseId,
      order: order || 0
    });

    await Course.findByIdAndUpdate(courseId, {
      $push: { sections: newSection._id }
    });

    res.status(201).json({ success: true, section: newSection });
  } catch (error) {
    res.status(500).json({ message: "Failed to create section" });
  }
};

export const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });

    await Course.findByIdAndUpdate(section.course, {
      $pull: { sections: sectionId }
    });

    await Lesson.deleteMany({ section: sectionId });


    await Section.findByIdAndDelete(sectionId);

    res.status(200).json({ message: "Section deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete section" });
  }
};