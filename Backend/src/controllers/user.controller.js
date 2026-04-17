import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import {generateToken} from "../lib/utils.js"
import { uploadOnCloudinary } from "../lib/cloudinary.js"
import Event from "../models/event.model.js"
import Registration from "../models/registration.model.js"

export const registerUser = async (req, res) => {
    const {fullname, email, password, phoneNumber, skillsPossessed} = req.body
    try{
        if(!fullname || !email || !password || !phoneNumber || !skillsPossessed){
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

export const saveEvent = async (req, res) => {
    const { eventId } = req.body
    console.log('Save event request - eventId:', eventId)
    console.log('Save event request - user role:', req.role)
    console.log('Save event request - user ID:', req.user?._id)
    
    try {
        if (req.role !== "user") {
            console.log('Access denied: User role is not "user"')
            return res.status(403).json({ message: "Only volunteers can save events" })
        }

        if (!eventId) {
            console.log('Bad request: Event ID is missing')
            return res.status(400).json({ message: "Event ID is required" })
        }

        console.log('Looking for event with ID:', eventId)
        const event = await Event.findById(eventId)
        if (!event) {
            console.log('Event not found:', eventId)
            return res.status(404).json({ message: "Event not found" })
        }

        console.log('Looking for user with ID:', req.user._id)
        const user = await User.findById(req.user._id)
        if (!user) {
            console.log('User not found:', req.user._id)
            return res.status(404).json({ message: "User not found" })
        }

        const isAlreadySaved = user.savedEvents.includes(eventId)
        console.log('Is event already saved:', isAlreadySaved)
        if (isAlreadySaved) {
            return res.status(400).json({ message: "Event already saved" })
        }

        user.savedEvents.push(eventId)
        console.log('Saving user with new saved events array')
        await user.save()

        console.log('Event saved successfully')
        return res.status(200).json({ message: "Event saved successfully" })
    } catch (error) {
        console.log(`Error in saving event : ${error}`)
        console.log('Error stack:', error.stack)
        return res.status(500).json({ message: error?.message || "Internal error in saving event" })
    }
}

export const getSavedEvents = async (req, res) => {
    try {
        if (req.role !== "user") {
            return res.status(403).json({ message: "Only volunteers can view saved events" })
        }

        const user = await User.findById(req.user._id).populate({
            path: 'savedEvents',
            populate: [
                { path: 'ngoId', select: 'name logo' }
            ]
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({ events: user.savedEvents })
    } catch (error) {
        console.log(`Error in getting saved events : ${error}`)
        return res.status(500).json({ message: error?.message || "Internal error in fetching saved events" })
    }
}

export const unsaveEvent = async (req, res) => {
    const { eventId } = req.body
    try {
        if (req.role !== "user") {
            return res.status(403).json({ message: "Only volunteers can unsave events" })
        }

        if (!eventId) {
            return res.status(400).json({ message: "Event ID is required" })
        }

        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        user.savedEvents = user.savedEvents.filter(id => id.toString() !== eventId)
        await user.save()

        return res.status(200).json({ message: "Event unsaved successfully" })
    } catch (error) {
        console.log(`Error in unsaving event : ${error}`)
        return res.status(500).json({ message: error?.message || "Internal error in unsaving event" })
    }
}

export const getRegisteredEvents = async (req, res) => {
    try {
        console.log('Getting registered events for user:', req.user._id);
        console.log('User role:', req.role);
        
        if (req.role !== "user") {
            console.log('Access denied: User role is not "user"');
            return res.status(403).json({ message: "Only volunteers can view registered events" })
        }

                
        // Get all registrations for this user (both pending and approved)
        const registrations = await Registration.find({ userId: req.user._id })
            .populate({
                path: 'eventId',
                populate: [
                    { path: 'ngoId', select: 'name logo' }
                ]
            })
            .sort({ createdAt: -1 })

        console.log('Found registrations:', registrations.length);
        console.log('Registrations:', JSON.stringify(registrations, null, 2));

        if (!registrations || registrations.length === 0) {
            console.log('No registrations found for user');
            return res.status(200).json({ events: [] })
        }

        // Format events with registration status
        const events = registrations.map(registration => ({
            ...registration.eventId.toObject(),
            registrationStatus: registration.status,
            registrationId: registration._id,
            appliedAt: registration.appliedAt,
            message: registration.message || ""
        }))

        console.log('Formatted events:', events.length);
        return res.status(200).json({ events })
    } catch (error) {
        console.log(`Error in getting registered events : ${error}`)
        console.log('Error stack:', error.stack);
        return res.status(500).json({ message: error?.message || "Internal error in fetching registered events" })
    }
}