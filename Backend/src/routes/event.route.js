import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { addEvent, volunteerForEvent } from '../controllers/event.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
const router = express.Router()

router.post("/add-event",protectRoute,upload.fields([{name: "image", maxCount: 1}]),addEvent)
router.post("/:id/volunteer",protectRoute,volunteerForEvent)

export default router