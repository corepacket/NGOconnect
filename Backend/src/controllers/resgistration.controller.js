import Registration from "../models/registration.model.js"
<<<<<<< HEAD
import User from "../models/user.model.js"
=======
import Event from "../models/event.model.js"
import User from "../models/user.model.js"
import NGO from "../models/ngo.model.js"
>>>>>>> f3a6fc8f889dddd32d507f038a41d6a32157b48d

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

<<<<<<< HEAD
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
=======
        const existing = await Registration.findOne({ userId, eventId })
        if (existing) {
            return res.status(400).json({ message: `Already applied (${existing.status}).` })
        }

        const registration = await Registration.create({
            userId,
            eventId,
            status: "pending",
            message: req.body?.message || "",
        })

        return res.status(201).json(registration)
>>>>>>> f3a6fc8f889dddd32d507f038a41d6a32157b48d
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

        const eventId = req.params.eventId
        const event = await Event.findById(eventId)
<<<<<<< HEAD
        if(!event){
            return res.status(404).json({message: "Event not found"})
        }

        if (!event.ngoId.equals(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to view registrations" });
        }

        const registrations = await Registration.find({eventId})
        .populate("userId", "fullname profilePic")
=======

        if (!event) {
            return res.status(400).json({ message: "Cannot find event" })
        }
        
        if (event.ngoId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" })
        }

        const registrations = await Registration.find({ eventId })
            .populate("userId", "fullname email profilePic skillsPossessed")
            .sort({ createdAt: -1 })

        return res.status(200).json({
            registrations: registrations.map((r) => ({
                _id: r._id,
                status: r.status,
                message: r.message || "",
                appliedAt: r.appliedAt,
                user: r.userId ? {
                    _id: r.userId._id,
                    fullname: r.userId.fullname,
                    email: r.userId.email,
                    profilePic: r.userId.profilePic,
                    skillsPossessed: r.userId.skillsPossessed || [],
                } : null,
            })),
        })
>>>>>>> f3a6fc8f889dddd32d507f038a41d6a32157b48d

        const users = registrations.map(reg => reg.userId)
        return res.status(200).json(users)
    }
    catch(error){
        console.log(`Error in viewing registrations : ${error}`)
        return res.status(500).json({ message: "Internal error in viewing registrations" })
    }
}

export const getNgoApplications = async (req, res) => {
    try {
        if (req.role !== "ngo") {
            return res.status(403).json({ message: "Only NGOs can view registrations" })
        }

        const events = await Event.find({ ngoId: req.user._id }).select("_id title date location image maxVolunteers")
        const eventIds = events.map((e) => e._id)

        const registrations = await Registration.find({ eventId: { $in: eventIds } })
            .populate("userId", "fullname email profilePic skillsPossessed")
            .populate("eventId", "title date location image maxVolunteers")
            .sort({ createdAt: -1 })

        return res.status(200).json({
            registrations: registrations.map((r) => ({
                _id: r._id,
                status: r.status,
                message: r.message || "",
                appliedAt: r.appliedAt,
                user: r.userId ? {
                    _id: r.userId._id,
                    fullname: r.userId.fullname,
                    email: r.userId.email,
                    profilePic: r.userId.profilePic,
                    skillsPossessed: r.userId.skillsPossessed || [],
                } : null,
                event: r.eventId ? {
                    _id: r.eventId._id,
                    title: r.eventId.title,
                    date: r.eventId.date,
                    location: r.eventId.location,
                    image: r.eventId.image,
                    maxVolunteers: r.eventId.maxVolunteers,
                } : null,
            })),
        })
    } catch (error) {
        console.log(`Error in getting NGO applications : ${error}`)
        return res.status(500).json({ message: "Internal error in fetching registrations" })
    }
}

export const acceptRegistration = async(req, res) => {
    try{
        if (req.role !== "ngo") {
            return res.status(403).json({ message: "Only NGOs can view registrations" })
        }

<<<<<<< HEAD
        const eventId = req.params.eventId
        const event = await Event.findById(eventId)
=======
        const eventId = req.params.id
        const registrationId = req.params.registrationId

        const event = await Event.findById(eventId)

>>>>>>> f3a6fc8f889dddd32d507f038a41d6a32157b48d
        if (!event) {
            return res.status(400).json({ message: "Cannot find event" })
        }

        if (!event.ngoId.equals(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to accept registrations" })
        }

<<<<<<< HEAD
        const user = await User.findById(req.params.userId)
        if(!user){
            return res.status(400).json({message: "Unregistered user"})
        }

        await Registration.findOneAndUpdate({userId: user._id, eventId: eventId}, {
            status: "approved"
        })

        return res.status(200).json({message: "Accepted user registration"})
=======
        const registration = await Registration.findOne({ _id: registrationId, eventId })
        if (!registration) {
            return res.status(404).json({ message: "Registration not found" })
        }
        if (registration.status === "approved") {
            return res.status(200).json({ message: "Already approved" })
        }
        if (event.maxVolunteers && event.volunteers.length >= event.maxVolunteers) {
            return res.status(400).json({ message: "No more volunteers needed for this event" })
        }

        registration.status = "approved"
        await registration.save()

        await Event.findByIdAndUpdate(eventId, { $addToSet: { volunteers: registration.userId } })
        await User.findByIdAndUpdate(registration.userId, { $addToSet: { eventsRegistered: eventId } })

        return res.status(200).json({ message: "Approved" })
>>>>>>> f3a6fc8f889dddd32d507f038a41d6a32157b48d
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

<<<<<<< HEAD
        const eventId = req.params.eventId
=======
        const eventId = req.params.id
        const registrationId = req.params.registrationId

>>>>>>> f3a6fc8f889dddd32d507f038a41d6a32157b48d
        const event = await Event.findById(eventId)
        if (!event) {
            return res.status(400).json({ message: "Cannot find event" })
        }
<<<<<<< HEAD

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
=======
        
        if (event.ngoId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" })
        }

        const registration = await Registration.findOne({ _id: registrationId, eventId })
        if (!registration) {
            return res.status(404).json({ message: "Registration not found" })
        }

        registration.status = "rejected"
        await registration.save()

        return res.status(200).json({ message: "Rejected" })
>>>>>>> f3a6fc8f889dddd32d507f038a41d6a32157b48d
    }
    catch(error){
        console.log(`Error in rejecting registration : ${error}`)
        return res.status(500).json({message: "Internal error in rejecting registration"})
    }
}