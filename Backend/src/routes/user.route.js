import express from 'express'
import {upload} from "../middlewares/multer.middleware.js"
import { protectRoute } from '../middlewares/auth.middleware.js'
import { registerUser, loginUser, logoutUser, saveEvent, viewSavedEvents, viewHistory } from '../controllers/user.controller.js'

const router = express.Router()

router.post("/register-user",upload.fields([{name: "profilePic", maxCount: 1}]),registerUser)
router.post("/login-user",loginUser)
router.post("/logout-user",logoutUser)
router.patch("/:eventId/save",protectRoute, saveEvent)
router.get("/view-saved-events",protectRoute,viewSavedEvents)
router.get("/view-history",protectRoute,viewHistory)

export default router;