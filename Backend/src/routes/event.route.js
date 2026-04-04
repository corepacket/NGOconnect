import express from 'express'

const router = express.Router()

router.post("/register-ngo",registerNGO)
router.post("/login-ngo",loginNGO)
router.post("/logout-ngo",logoutNGO)

export default router