import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { acceptRegistration, getNgoApplications, rejectRegistration, volunteerForEvent, viewEventRegistrations } from '../controllers/resgistration.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { getAllEvents, getEventById, getMyEvents, addEvent, updateEvent, deleteEvent } from '../controllers/event.controller.js'
const router = express.Router()

router.get("/",getAllEvents)

router.get("/ngo/my-events",protectRoute,getMyEvents)
router.get("/ngo/applications", protectRoute, getNgoApplications)
router.get("/:id",getEventById)


router.post("/add-event",protectRoute,upload.fields([{name: "image", maxCount: 1}]),addEvent)
router.patch("/:id", protectRoute, upload.fields([{name: "image", maxCount: 1}]), updateEvent)
router.delete("/:id", protectRoute, deleteEvent)
router.post("/:eventId/volunteer",protectRoute,volunteerForEvent)
router.post("/:id/view-registrations",protectRoute,viewEventRegistrations)
router.post("/:id/registrations/:registrationId/approve", protectRoute, acceptRegistration)
router.post("/:id/registrations/:registrationId/reject", protectRoute, rejectRegistration)

export default router