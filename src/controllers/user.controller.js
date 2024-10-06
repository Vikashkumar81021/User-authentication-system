import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/apiError.js';
import { User } from "../models/user.model.js";

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, password, age, phone } = req.body;

    if (![email, userName, password, age, phone].every(Boolean)) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
        throw new ApiError(409, "Username or Email already exists");
    }

    const newUser = new User({ userName, password, email, age, phone });
    await newUser.save();

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: { userName, email, age, phone },
    });
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    return res.json({ accessToken });
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);
    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out successfully" });
});

// Get User Profile (Example CRUD operation)
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.json({ user });
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
    const { userName, email, phone, age } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { userName, email, phone, age },
        { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.json({ user: updatedUser });
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.json({ message: "User deleted successfully" });
});

export { registerUser, loginUser, logoutUser, getUserProfile, updateUser, deleteUser };

