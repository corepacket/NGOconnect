import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { addEvent, viewEvent, viewAllEvents, markEventCompleted } from '../controllers/event.controller.js'
import { volunteerForEvent, viewEventRegistrations, acceptRegistration, rejectRegistration } from '../controllers/resgistration.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
const router = express.Router()

router.post("/add-event",protectRoute,upload.fields([{name: "image", maxCount: 1}]),addEvent)
router.get("/:eventId/view",viewEvent)
router.get("/view-events",viewAllEvents)
router.patch("/:eventId/mark-as-completed",protectRoute,markEventCompleted)
router.post("/:eventId/volunteer",protectRoute,volunteerForEvent)
router.get("/:eventId/view-registrations",protectRoute,viewEventRegistrations)
router.patch("/:eventId/registrations/:userId/accept",protectRoute,acceptRegistration)
router.patch("/:eventId/registrations/:userId/reject",protectRoute,rejectRegistration)

export default router