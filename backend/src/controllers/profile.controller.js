import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

// GET logged-in user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// UPDATE profile (name / password)
export const updateProfile = async (req, res) => {
  try {
    const { name, oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(newPassword){
      if(!oldPassword){
        return res.status(400).json({message:"Please provide your old password"});

      }

      const isMatch=await bcrypt.compare(oldPassword,user.password);
      if(!isMatch){
        return res.status(401).json({message:"Old password is incorrect"});
      }
      user.password=newPassword; // will be hashed in pre-save hook
    }

    if (name) user.name = name;
    // if (password) user.password = password

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
};
