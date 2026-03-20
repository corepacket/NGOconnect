import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routes/user.route.js'
import ngoRouter from './routes/ngo.route.js'
import eventRouter from './routes/event.route.js'

const app=express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.post("/api/users",userRouter)
app.post("/api/ngos",ngoRouter)
app.post("/api/events",eventRouter)

export default app