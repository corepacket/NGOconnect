import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { addEvent } from '../controllers/event.controller.js'
import { volunteerForEvent, viewRegistrations } from '../controllers/resgistration.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
const router = express.Router()

router.post("/add-event",protectRoute,upload.fields([{name: "image", maxCount: 1}]),addEvent)
router.post("/:id/volunteer",protectRoute,volunteerForEvent)
router.post("/:id/view-registrations",protectRoute,viewRegistrations)

export default router