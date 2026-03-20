import express from 'express'
import cookieParser from 'cookie-parser'

const app=express()

app.use(express.json())
app.use(cookieParser())

app.post("/api/users",userRouter)
app.post("/api/ngos",ngoRouter)
app.post("/api/events",eventRouter)

export default app