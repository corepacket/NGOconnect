import express from 'express'
import {upload} from "../middlewares/multer.middleware.js"
import { registerUser, loginUser, logoutUser, volunteerForEvent } from '../controllers/user.controller.js';

const router = express.Router()

router.post("/register-user",upload.fields([{name: "profilePic", maxCount: 1}]),registerUser)
router.post("/login-user",loginUser)
router.post("/logout-user",logoutUser)

export default router;