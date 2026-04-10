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
export const getAllEvents=async(_, res)=>{
    try{
        const events= await Event.find({})
        .populate("ngoId","name email logo location website")
        .sort({createdAt:-1})

        return res.status(200).json(events)
    }
    catch(error){
        console.log(`Error in getting all events : ${error}`)
        return res.status(500).json({ message: "Internal error in fetching events" })
    }
}
export const getEventById=async(req,res)=>{
    const{id}=req.params
try{
    const event=await Event.findById(id)
    .populate("ngoId", "name email logo location website briefDescription")
      .populate("volunteers", "fullname email profilePic skillsPossessed")
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    return res.status(200).json(event)
}
catch(error){
    console.log(`Error in getting event by id : ${error}`)
    return res.status(500).json({ message: "Internal error in fetching event" })
}
}
export const getMyEvents=async(req,res)=>{
    try{
        if(req.role!=="ngo"){
            return res.status(403).json({message: "Only NGOs can view their events"})
        }

    const events = await Event.find({ ngoId: req.user._id })
      .populate("volunteers", "fullname email profilePic")
      .sort({ createdAt: -1 })
    return res.status(200).json(events)
  } catch (error) {
    console.log(`Error in getting NGO events : ${error}`)
    return res.status(500).json({ message: "Internal error in fetching NGO events" })
  }
}
