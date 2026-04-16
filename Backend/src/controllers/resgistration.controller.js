import Registration from "../models/registration.model.js"
import Event from "../models/event.model.js"
import User from "../models/user.model.js"

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

    } catch (error) {
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

        const eventId = req.params.id
        const registrationId = req.params.registrationId

        const event = await Event.findById(eventId)

        if (!event) {
            return res.status(400).json({ message: "Cannot find event" })
        }
        
        if (event.ngoId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" })
        }

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

        const eventId = req.params.id
        const registrationId = req.params.registrationId

        const event = await Event.findById(eventId)
        if (!event) {
            return res.status(400).json({ message: "Cannot find event" })
        }
        
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
    }
    catch(error){
        console.log(`Error in rejecting registration : ${error}`)
        return res.status(500).json({message: "Internal error in rejecting registration"})
    }
}

const mapEventLite = (event) => ({
    _id: event?._id,
    title: event?.title || "Event",
    date: event?.date,
    location: event?.location || "",
    image: event?.image || "",
    maxVolunteers: Number(event?.maxVolunteers || 0),
    ngo: {
        _id: event?.ngoId?._id,
        name: event?.ngoId?.name || "NGO",
        logo: event?.ngoId?.logo || "",
    },
})

export const getVolunteerApplications = async (req, res) => {
    try {
        if (req.role !== "user") {
            return res.status(403).json({ message: "Only volunteers can view their applications" })
        }

        const registrations = await Registration.find({ userId: req.user._id })
            .populate({
                path: "eventId",
                select: "title date location image maxVolunteers ngoId",
                populate: { path: "ngoId", select: "name logo" },
            })
            .sort({ createdAt: -1 })

        const now = new Date()
        const data = registrations
            .filter((r) => r.eventId)
            .map((r) => {
                const eventDate = r.eventId?.date ? new Date(r.eventId.date) : null
                const isPast = Boolean(eventDate && eventDate < now)
                return {
                    _id: r._id,
                    status: r.status,
                    appliedAt: r.appliedAt,
                    message: r.message || "",
                    isPast,
                    event: mapEventLite(r.eventId),
                }
            })

        return res.status(200).json({ registrations: data })
    } catch (error) {
        console.log(`Error in getting volunteer applications : ${error}`)
        return res.status(500).json({ message: "Internal error in fetching volunteer applications" })
    }
}

export const toggleSaveEvent = async (req, res) => {
    try {
        if (req.role !== "user") {
            return res.status(403).json({ message: "Only volunteers can save events" })
        }

        const eventId = req.params.id
        const event = await Event.findById(eventId)
        if (!event) {
            return res.status(404).json({ message: "Event not found" })
        }

        const user = await User.findById(req.user._id).select("savedEvents")
        const alreadySaved = user.savedEvents.some((savedId) => savedId.toString() === eventId)

        await User.findByIdAndUpdate(
            req.user._id,
            alreadySaved
                ? { $pull: { savedEvents: eventId } }
                : { $addToSet: { savedEvents: eventId } }
        )

        return res.status(200).json({
            saved: !alreadySaved,
            message: alreadySaved ? "Event removed from saved list" : "Event saved",
        })
    } catch (error) {
        console.log(`Error in saving event : ${error}`)
        return res.status(500).json({ message: "Internal error in saving event" })
    }
}

export const getVolunteerSavedEvents = async (req, res) => {
    try {
        if (req.role !== "user") {
            return res.status(403).json({ message: "Only volunteers can view saved events" })
        }

        const user = await User.findById(req.user._id)
            .populate({
                path: "savedEvents",
                select: "title date location image maxVolunteers ngoId",
                populate: { path: "ngoId", select: "name logo" },
            })
            .select("savedEvents")

        const savedEvents = (user?.savedEvents || []).map(mapEventLite)
        return res.status(200).json({ savedEvents })
    } catch (error) {
        console.log(`Error in getting saved events : ${error}`)
        return res.status(500).json({ message: "Internal error in fetching saved events" })
    }
}