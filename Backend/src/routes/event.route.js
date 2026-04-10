import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { addEvent } from '../controllers/event.controller.js'
import { volunteerForEvent, viewEventRegistrations, acceptRegistration } from '../controllers/resgistration.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
const router = express.Router()

router.post("/add-event",protectRoute,upload.fields([{name: "image", maxCount: 1}]),addEvent)
router.post("/:eventId/volunteer",protectRoute,volunteerForEvent)
router.get("/:eventId/view-registrations",protectRoute,viewEventRegistrations)
router.patch("/:eventId/registrations/:userId/accept",protectRoute,acceptRegistration)

export default router