import { uploadOnCloudinary } from "../lib/cloudinary.js"
import Event from "../models/event.model.js"

export const addEvent = async (req, res) => {
    const {title, description, location, date, timings, maxVolunteers, skillsRequired} = req.body

    try{
        if(req.role != "ngo"){
            return res.status(403).json({message: "Only NGOs can add events"})
        }

        if(!title || !description || !location || !date || !timings || !maxVolunteers){
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
            timings,
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

export const viewEvent = async(req, res) => {
    try{
        const eventId = req.params.eventId

        const event = await Event.findById(eventId)
        if(!event){
            return res.status(400).json({message: "Event not found"})
        }

        return res.status(200).json(event)
    }
    catch(error){
        console.log(`Error in viewing event : ${error}`)
        return res.status(500).json({message: 'Internal error in viewing event'})
    }
}

export const viewAllEvents = async(_, res) => {
    try{
        const events = await Event.find()
        return res.status(200).json(events)
    }
    catch(error){
        console.log(`Error in viewing events : ${error}`)
        return res.status(500).json({message: 'Internal error in viewing events'})
    }
}
