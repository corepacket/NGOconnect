import mongoose from 'mongoose'

export const connectDB = async() => {
    try{
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is missing in Backend/.env")
        }
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    }
    catch(error){
        console.log(`MongoDB connection error: ${error}`)
        throw error
    }
}