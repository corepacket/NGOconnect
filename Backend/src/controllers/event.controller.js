import Event from "../models/event.model.js"

export const addEvent = async (req, res) => {
    const {title, description, location, date, maxVolunteers, skillsRequired} = req.body

    try{
        if(req.role != "ngo"){
            return res.status(403).json({message: "Only NGOs can add events"})
        }

        if(!title || !description || !location || !date || !maxVolunteers){
            return res.status(400).json({message: "All fields are required"})
        }

        const event = await Event.create({
            title,
            description,
            location,
            date,
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