import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { addEvent, volunteerForEvent } from '../controllers/event.controller.js'
const router = express.Router()

router.post("/add-event",protectRoute,addEvent)
router.post("/:id/volunteer",protectRoute,addEvent)

export default router