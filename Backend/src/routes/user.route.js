import express from 'express'

const router = express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/view-registered-events",viewRegisteredEvents)
router.post("/view-completed-events",viewRegisteredEvents)
router.post("/logout",logoutUser)

export default router;