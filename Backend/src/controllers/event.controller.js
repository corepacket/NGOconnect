import { uploadOnCloudinary } from "../lib/cloudinary.js"
import Event from "../models/event.model.js"
import NGO from "../models/ngo.model.js"
import User from "../models/user.model.js"
import Registration from "../models/registration.model.js"

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

export const markEventCompleted = async(req, res) => {
    try{
        if(req.role!="ngo"){
            return res.status(403).json({message: 'Only NGOs can mark events completed'})
        }

        const ngoId = req.user._id
        const ngo = await NGO.findById(ngoId)

        if(!ngo){
            return res.status(404).json({message: "NGO not found"})
        }

        const eventId = req.params.eventId
        const event = await Event.findById(eventId)

        if(!event){
            return res.status(404).json({message: "Event not found"})
        }

        if(!event.ngoId.equals(ngoId)){
            return res.status(403).json({message: "Not authorized to mark this event completed"})
        }

        const registrations = await Registration.find({eventId})
        const volunteers = registrations.map(reg => reg.userId)

        await PastEvent.create({
            title: event.title,
            description: event.description,
            location: event.location,
            date: event.date,
            timings: event.timings,
            image: event.image || "",
            imageId: event.imageId || "",
            ngoId,
            volunteers: volunteers || []
        })

        await Registration.deleteMany({eventId})
        await Event.findByIdAndDelete(eventId)

        return res.status(200).json({message: "Event marked as completed"})
    }
    catch(error){
        console.log(`Error in marking event as completed : ${error}`)
        return res.status(500).json({message: "Internal error in marking event as completed"})
    }
}
