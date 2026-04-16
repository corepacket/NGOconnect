import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import {
  acceptRegistration,
  getNgoApplications,
  getVolunteerApplications,
  getVolunteerSavedEvents,
  rejectRegistration,
  toggleSaveEvent,
  volunteerForEvent,
  viewRegistrations,
} from '../controllers/resgistration.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { getAllEvents, getEventById, getMyEvents, addEvent, updateEvent, deleteEvent } from '../controllers/event.controller.js'
const router = express.Router()

router.get("/",getAllEvents)

router.get("/ngo/my-events",protectRoute,getMyEvents)
router.get("/ngo/applications", protectRoute, getNgoApplications)
router.get("/volunteer/applications", protectRoute, getVolunteerApplications)
router.get("/volunteer/saved-events", protectRoute, getVolunteerSavedEvents)
router.get("/:id",getEventById)


router.post("/add-event",protectRoute,upload.fields([{name: "image", maxCount: 1}]),addEvent)
router.patch("/:id", protectRoute, upload.fields([{name: "image", maxCount: 1}]), updateEvent)
router.delete("/:id", protectRoute, deleteEvent)
router.post("/:id/volunteer",protectRoute,volunteerForEvent)
router.post("/:id/save-toggle",protectRoute,toggleSaveEvent)
router.post("/:id/view-registrations",protectRoute,viewRegistrations)
router.post("/:id/registrations/:registrationId/approve", protectRoute, acceptRegistration)
router.post("/:id/registrations/:registrationId/reject", protectRoute, rejectRegistration)

export default router