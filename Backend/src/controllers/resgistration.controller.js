import Registration from "../models/registration.model.js"
import Event from "../models/event.model.js"
import User from "../models/user.model.js"
import NGO from "../models/ngo.model.js"

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
        
        return res.status(200).json(user)
    }
    catch(error){
        console.log(`Error in registering for event : ${error}`)
        return res.status(500).json({message: "Internal error in registering for event"})
    }
}

export const viewRegistrations = async (req, res) => {
    try {
        if (req.role !== "ngo") {
            return res.status(403).json({ message: "Only NGOs can view registrations" })
        }

        const eventId = req.params.id

        const event = await Event.findById(eventId)
            .populate("volunteers", "fullname email")

        if (!event) {
            return res.status(400).json({ message: "Cannot find event" })
        }
        
        if (event.ngoId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" })
        }

        const volunteers = event.volunteers.map(user => ({
            name: user.fullname,
            email: user.email
        }))

        return res.status(200).json({ volunteers })

    } catch (error) {
        console.log(`Error in viewing registrations : ${error}`)
        return res.status(500).json({ message: "Internal error in viewing registrations" })
    }
}

export const acceptRegistration = async(req, res) => {
    try{
        if (req.role !== "ngo") {
            return res.status(403).json({ message: "Only NGOs can view registrations" })
        }

        const eventId = req.params.id

        const event = await Event.findById(eventId)
            .populate("volunteers", "fullname email")

        if (!event) {
            return res.status(400).json({ message: "Cannot find event" })
        }
        
        if (event.ngoId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" })
        }
        
    }
    catch(error){
        console.log(`Error in accepting registration : ${error}`)
        return res.status(500).json({message: "Internal error in accepting registration"})
    }
}