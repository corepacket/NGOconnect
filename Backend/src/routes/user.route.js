import express from 'express'
import {upload} from "../middlewares/multer.middleware.js"
import { protectRoute } from '../middlewares/auth.middleware.js';
import { registerUser, loginUser, logoutUser, updateUserProfilePic } from '../controllers/user.controller.js';

const router = express.Router()

router.post("/register-user",upload.fields([{name: "profilePic", maxCount: 1}]),registerUser)
router.post("/login-user",loginUser)
router.post("/logout-user",logoutUser)
router.patch("/profile-picture", protectRoute, upload.fields([{name: "profilePic", maxCount: 1}]), updateUserProfilePic)

export default router;