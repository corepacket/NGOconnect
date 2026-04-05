import express from 'express'
import { upload } from '../middlewares/multer.middleware.js'
import {registerNGO, loginNGO, logoutNGO } from '../controllers/ngo.controller.js'

const router = express.Router()

router.post("/register-ngo",upload.fields([{name: "logo", maxCount: 1}]),registerNGO)
router.post("/login-ngo",loginNGO)
router.post("/logout-ngo",logoutNGO)

export default router;