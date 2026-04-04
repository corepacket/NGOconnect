import express from 'express'
import {registerNGO, loginNGO, logoutNGO } from '../controllers/ngo.controller.js'

const router = express.Router()

router.post("/register-ngo",registerNGO)
router.post("/login-ngo",loginNGO)
router.post("/logout-ngo",logoutNGO)

export default router;