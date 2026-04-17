import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import {generateToken} from "../lib/utils.js"
import { uploadOnCloudinary } from "../lib/cloudinary.js"

export const registerUser = async (req, res) => {
    const {fullname, email, password, phoneNumber, skillsPossessed} = req.body
    try{
        if(!fullname || !email || !password || !phoneNumber){
            return res.status(400).json({message:"All fields are required"})
        }

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({message: "User with email already exists"})
        }

        if(password.length<6){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }

        const normalizedPhone = String(phoneNumber).replace(/\D/g, "")
        if(normalizedPhone.length != 10){
            return res.status(400).json({message: "Phone number should be of 10 digits"})
        }

        const profilePicLocalPath = req.files?.profilePic?.[0]?.path
        const profilePic = profilePicLocalPath ? await uploadOnCloudinary(profilePicLocalPath) : null

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            phoneNumber: normalizedPhone,
            address : req.body.address || "",
            profilePic: profilePic?.secure_url || "",
            profilePicId: profilePic?.public_id || "",
            skillsPossessed: skillsPossessed
        })

        generateToken(user._id, "user", res)

        return res.status(201).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profilePic: user.profilePic
        })
    } 
    catch(error){
        console.log(`Error in registering user : ${error}`)
        return res.status(500).json({message: error?.message || "Internal error in registering user"})
    }
}

export const loginUser = async (req, res) => {
    const {email, password} = req.body
    try{
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "Invalid credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"})
        }

        generateToken(user._id, "user", res)

        return res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profilePic: user.profilePic
        })
    }
    catch(error){
        console.log(`Errror in logging in : ${error}`)
        return res.status(500).json({message: error?.message || "Iternal error in logging in"})
    }
}

export const logoutUser = async (_, res) => {
    try{
        res.cookie("jwt","",{maxAge: 0})
        return res.status(200).json({message: "Logged out successfully"})
    }
    catch(error){
        console.log(`Error in logging out : ${error}`)
        return res.status(500).json("Internal error in logging out")
    }
}

export const updateUserProfilePic = async (req, res) => {
    try {
        if (req.role !== "user") {
            return res.status(403).json({ message: "Only volunteers can update profile image" })
        }

        const profilePicLocalPath = req.files?.profilePic?.[0]?.path
        if (!profilePicLocalPath) {
            return res.status(400).json({ message: "Profile image file is required" })
        }

        const profilePic = await uploadOnCloudinary(profilePicLocalPath)
        if (!profilePic?.secure_url) {
            return res.status(500).json({ message: "Failed to upload profile image" })
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profilePic: profilePic.secure_url, profilePicId: profilePic.public_id || "" },
            { new: true }
        ).select("-password")

        return res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log(`Error in updating user profile image : ${error}`)
        return res.status(500).json({ message: error?.message || "Internal error in updating profile image" })
    }
}