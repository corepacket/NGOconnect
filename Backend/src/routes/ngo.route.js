import express from 'express'
import { upload } from '../middlewares/multer.middleware.js'
import { protectRoute } from '../middlewares/auth.middleware.js'
import {registerNGO, loginNGO, logoutNGO, updateNgoLogo } from '../controllers/ngo.controller.js'

const router = express.Router()

router.post("/register-ngo",upload.fields([{name: "logo", maxCount: 1}]),registerNGO)
router.post("/login-ngo",loginNGO)
router.post("/logout-ngo",logoutNGO)
router.patch("/logo", protectRoute, upload.fields([{name: "logo", maxCount: 1}]), updateNgoLogo)

export default router;