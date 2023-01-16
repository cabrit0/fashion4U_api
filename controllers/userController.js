const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

// @desc    Register a user
// @route   POST /api/users/register
// @Access  Public
const register = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    // Create new user
    user = new User({ name, email, password });
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    // Save user to db
    await user.save();
    // Create and sign JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @desc    Login a user
// @route   POST /api/users/login
// @Access  Public
const login = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }
    // Create and sign JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user });
      }
    );
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @Access  Private
const getProfile = asyncHandler(async (req, res) => {
  try {
    //      const _id = req.body;        just to test (send the user or user.id in the frontend)
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @desc    Update current user's profile
// @route   PUT /api/users/profile
// @Access  Private
const updateProfile = asyncHandler(async (req, res) => {
  try {
    // (req.body.id, req.body)    just to test (send the user or user.id in the frontend)
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    }).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    //make inputs for updating the user then complete this
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @desc Delete current user's profile
// @route DELETE /api/users/profile
// @Access Private
const deleteProfile = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndRemove(req.user.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @desc Change current user's password
// @route PUT /api/users/password
// @Access Private
const changePassword = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    // Compare old password
    const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid old password" });
    }
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);
    // Save new password
    await user.save();
    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @desc Get all users
// @route GET /api/users
// @Access Private (Admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @desc Delete a user by id
// @route DELETE /api/users/:id
// @Access Private (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @desc Update a user by id
// @route PUT /api/users/:id
// @Access Private (Admin only)
const updateUser = asyncHandler(async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @desc Get a user by id
// @route GET /api/users/:id
// @Access Private (Admin only)
const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
  changePassword,
  getAllUsers,
  deleteUser,
  updateUser,
  getUser,
};
