import { generateToken } from "../lib/utils.js"
import bcrypt from "bcryptjs"
import NGO from "../models/ngo.model.js"
import { uploadOnCloudinary } from "../lib/cloudinary.js"

export const registerNGO = async(req, res) => {
    const {name, email, password, contactNumber, location} = req.body

    try{
        if(!name || !email || !password || !contactNumber || !location){
            return res.status(400).json({message: "All fields are required"})
        }

        const existingNGO = await NGO.findOne({email})

        if(existingNGO){
            return res.status(400).json({message: "NGO already exists"})
        }

        if(password.length<6){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }

        if(contactNumber.length!=10){
            return res.status(400).json({message: "Phone number should be of 10 digits"})
        }

        let logoLocaPath
        if(req.files?.logo && req.files?.logo[0]){
            logoLocaPath = req.files.logo[0].path
        }

        const logo = logoLocaPath ? await uploadOnCloudinary(logoLocaPath) : null

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const ngo = await NGO.create({
            name,
            email,
            password: hashedPassword,
            contactNumber,
            location,
            logo: logo?.secure_url || "",
            logoId: logo?.public_id || ""
        })

        generateToken(ngo._id, "ngo", res)

        return res.status(201).json({
            _id: ngo._is,
            name: ngo.name,
            email: ngo.email,
            contactNumber: ngo.contactNumber
        })
    }
    catch(error){
        console.log(`Error in registering NGO : ${error}`)
        return res.status(500).json({message: "Internal error in registering NGO"})
    }
}

export const loginNGO = async(req, res) => {
    const {email, password} = req.body

    try{
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const ngo = await NGO.findOne({email})

        if(!ngo){
            return res.status(400).json({message: "Invalid credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, ngo.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"})
        }

        generateToken(ngo._id, "ngo", res)
        
        return res.status(200).json({
            _id: ngo._id,
            name: ngo.name,
            email: ngo.email,
            contactNumber: ngo.contactNumber
        })
    }
    catch(error){
        console.log(`Error in logging in : ${error}`)
        return res.status(500).json({message: "Internal error in logging in"})
    }
}

export const logoutNGO = async (_, res) => {
    try{
        res.cookie("jwt", "", {maxAge: 0})
        return res.status(200).json({message: "Logged out successfully"})
    }
    catch(error){
        console.log(`Error in logging out : ${error}`)
        return res.status(500).json({message: "Internal error in logging out"})
    }
}