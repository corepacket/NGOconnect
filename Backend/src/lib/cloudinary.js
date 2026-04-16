import dotenv from 'dotenv'
dotenv.config()
import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(localFilePath) => {
    if(!localFilePath) return null
    try{
        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
            throw new Error("Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Backend/.env")
        }
        const response = await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})
        return response
    }
    catch(error){
        throw new Error(error?.message || "Cloudinary upload failed")
    }
    finally{
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
    }
}

export {uploadOnCloudinary}