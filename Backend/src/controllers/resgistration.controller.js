import Registration from "../models/registration.model.js"
import User from "../models/user.model.js"

export const volunteerForEvent = async (req, res) => {
    try{
        if(req.role != "user"){
            return res.status(403).json({message: "Only users can register for events"})
        }

        const eventId = req.params.eventId
        const event = await Event.findById(eventId)

        const userId = req.user._id

        if(!event){
            return res.status(404).json({message: "Event not found"})
        }

        const existing = await Registration.findOne({userId: userId, eventId: eventId})
        if(existing){
            if(existing.status=="rejected"){
                return res.status(400).json({message: "Application rejected"})
            }
            else if(existing.status=="approved"){
                return res.status(400).json({message: "Already registered"})
            }
            else{
                return res.status(400).json({message: "Approval of registration pending"})
            }
        }

        const approvedRegs = await Registration.find({eventId: eventId, status: "approved"})
        if(approvedRegs.length == event.maxVolunteers){
            return res.status(400).json({message: "No more volunteers needed for this event"})
        }

        const {message} = req.body

        await Registration.create({
            userId,
            eventId,
            message,
        })

        return res.status(200).json({message: "Registration successfully completed and sent for approval"})
    }
    catch(error){
        console.log(`Error in registering for event : ${error}`)
        return res.status(500).json({message: "Internal error in registering for event"})
    }
}

export const viewEventRegistrations = async (req, res) => {
    try {
        if (req.role !== "ngo") {
            return res.status(403).json({ message: "Only NGOs can view registrations" })
        }

        const eventId = req.params.eventIdd

        const event = await Event.findById(eventId)
        .populate("volunteers", "fullname email")

        if (!event) {
            return res.status(400).json({ message: "Cannot find event" })
        }
        
        if (!event.ngoId.equals(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to view registrations" });
        }

        const registrations = await Registration.find({ event: event._id })
        .populate("user", "fullName profilePic")

        return res.status(200).json(registrations)

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

        const eventId = req.params.eventId
        const event = await Event.findById(eventId)
        if (!event) {
            return res.status(400).json({ message: "Cannot find event" })
        }

        if (!event.ngoId.equals(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to accept registrations" })
        }

        const user = await User.findById(req.params.userId)
        if(!user){
            return res.status(400).json({message: "Unregistered user"})
        }

        await Registration.findOneAndUpdate({userId: user._id, eventId: eventId}, {
            status: "approved"
        })

        return res.status(200).json({message: "Accepted user registration"})
    }
    catch(error){
        console.log(`Error in accepting registration : ${error}`)
        return res.status(500).json({message: "Internal error in accepting registration"})
    }
}

export const rejectRegistration = async(req, res) => {
    try{
        if (req.role !== "ngo") {
            return res.status(403).json({ message: "Only NGOs can view registrations" })
        }

        const eventId = req.params.eventId
        const event = await Event.findById(eventId)
        if (!event) {
            return res.status(400).json({ message: "Cannot find event" })
        }

        if (!event.ngoId.equals(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to reject registrations" })
        }

        const user = await User.findById(req.params.userId)
        if(!user){
            return res.status(400).json({message: "Unregistered user"})
        }

        await Registration.findOneAndUpdate({userId: user._id, eventId: eventId}, {
            status: "rejected"
        })

        return res.status(200).json({message: "Rejected user registration"})
    }
    catch(error){
        console.log(`Error in rejecting registration : ${error}`)
        return res.status(500).json({message: "Internal error in rejecting registration"})
    }
}