const User = require("../models/User");
const bcrypt = require("bcryptjs");

const generateToken = require("../utils/generateToken");


// REGISTER
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true   // skip email verification
    });

    res.json({
      message: "Account created successfully",
      token: generateToken(user._id, user.name),
      name: user.name
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id, user.name),
      name: user.name
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// FORGOT PASSWORD (kept simple)
exports.forgotPassword = async (req, res) => {
  res.json({ message: "Password reset not available in this version" });
};

// RESET PASSWORD (kept simple)
exports.resetPassword = async (req, res) => {
  res.json({ message: "Password reset not available in this version" });
};

// VERIFY EMAIL (kept for route compatibility)
exports.verifyEmail = async (req, res) => {
  res.json({ message: "Email verification not required" });
};
