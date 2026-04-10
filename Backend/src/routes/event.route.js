import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { volunteerForEvent, viewRegistrations } from '../controllers/resgistration.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { getAllEvents, getEventById, getMyEvents, addEvent } from '../controllers/event.controller.js'
const router = express.Router()

router.get("/",getAllEvents)

router.get("/ngo/my-events",protectRoute,getMyEvents)
router.get("/:id",getEventById)


router.post("/add-event",protectRoute,upload.fields([{name: "image", maxCount: 1}]),addEvent)
router.post("/:id/volunteer",protectRoute,volunteerForEvent)
router.post("/:id/view-registrations",protectRoute,viewRegistrations)

export default router