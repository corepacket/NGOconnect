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

app.use("/api/users",userRouter)
app.use("/api/ngos",ngoRouter)
app.use("/api/events",eventRouter)

export default app