import User from "../models/User.model.js";

// GET logged-in user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

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
    const { name, password } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (password) user.password = password; // auto-hashed

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
};
