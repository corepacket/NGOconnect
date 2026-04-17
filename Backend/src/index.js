import dns from "dns"
dns.setDefaultResultOrder("ipv4first")
import dotenv from 'dotenv'
dotenv.config({ path: "./.env" })
import app from './app.js'
import {connectDB} from './lib/db.js'
import { env } from './config/env.js'

connectDB()
.then(()=>{
    app.listen(env.port,()=>{
        console.log(`Server is running on port ${env.port}`)
    })
})
.catch((err)=>{
    console.log(`MongoDB connection failed ${err}`)
})