import express from 'express'
import { registerUser, loginUser, logoutUser } from '../controllers/user.controller.js';

const router = express.Router()

router.post("/register-user",registerUser)
router.post("/login-user",loginUser)
// router.post("/view-registered-events",viewRegisteredEvents)
// router.post("/view-completed-events",viewRegisteredEvents)
router.post("/logout-user",logoutUser)

export default router;