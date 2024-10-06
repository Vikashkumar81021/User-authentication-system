

import { Router } from "express";
import { loginUser, logoutUser, registerUser, getUserProfile, updateUser, deleteUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//private route
router.route("/logout").post(authMiddleware, logoutUser);
router.route("/profile").get(authMiddleware, getUserProfile);
router.route("/update").put(authMiddleware, updateUser);
router.route("/delete").delete(authMiddleware, deleteUser);

export default router;
