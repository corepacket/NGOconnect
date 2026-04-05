import dotenv from 'dotenv'
import {connectDB} from './lib/db.js'


dotenv.config({ path: "./.env" })

import app from './app.js'
connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log(`MongoDB connection failed ${err}`)
})