import { uploadOnCloudinary } from "../lib/cloudinary.js"
import Event from "../models/event.model.js"
import User from "../models/user.model.js"

export const addEvent = async (req, res) => {
    const {title, description, location, date, maxVolunteers, skillsRequired} = req.body

    try{
        if(req.role != "ngo"){
            return res.status(403).json({message: "Only NGOs can add events"})
        }

        if(!title || !description || !location || !date || !maxVolunteers){
            return res.status(400).json({message: "All fields are required"})
        }

        let imageLocalPath
        if(req.files?.image && req.files?.image[0]){
            imageLocalPath = req.files.image[0].path
        }

        const image = imageLocalPath ? await uploadOnCloudinary(imageLocalPath) : null

        const event = await Event.create({
            title,
            description,
            location,
            date,
            image: image?.secure_url || "",
            imageId: image?.public_id || "",
            ngoId: req.user._id,
            skillsRequired: skillsRequired || [],
            maxVolunteers
        })

        return res.status(201).json(event)
    }
    catch(error){
        console.log(`Error in adding event : ${error}`)
        return res.status(500).json({message: "Internal error in adding event"})
    }
}

export const volunteerForEvent = async (req, res) => {
    try{
        if(req.role != "user"){
            return res.status(403).json({message: "Only users can register for events"})
        }

        const eventId = req.params.id
        const event = await Event.findById(eventId)

        const userId = req.user._id

        if(!event){
            return res.status(404).json({message: "Event not found"})
        }

        if(event.volunteers.includes(userId)){
            return res.status(400).json({message: "Already registered for current event"})
        }

        if(event.volunteers.length == event.maxVolunteers){
            return res.status(400).json({message: "No more volunteers needed for this event"})
        }
        
        const user = await User.findById(userId)
        user.eventsRegistered.push(event._id)
        await user.save()

        event.volunteers.push(userId)
        await event.save()
        
        await User.findByIdAndUpdate(userId, {
            $addToSet: { eventsRegistered: eventId }
        })
        
        return res.status(200).json({message: "Successully registered for event"})
    }
    catch(error){
        console.log(`Error in registering for event : ${error}`)
        return res.status(500).json({message: "Internal error in registering for event"})
    }
}