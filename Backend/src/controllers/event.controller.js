import { uploadOnCloudinary } from "../lib/cloudinary.js"
import Event from "../models/event.model.js"
import NGO from "../models/ngo.model.js"
import User from "../models/user.model.js"
import Registration from "../models/registration.model.js"

const defaultRequirements = [
    "Be on time",
    "Carry valid ID",
    "Follow event coordinator instructions",
  ];
  const defaultBenefits = [
    "Certificate of participation",
    "Community impact",
    "Networking opportunity",
  ];
  const normalizeArrayField = (value, fallback = []) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string" && value.trim()) {
      return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }
    return fallback;
  };
  const mapVolunteer = (v) => ({
    id: v?._id,
    name: v?.fullname || "Volunteer",
    avatar: v?.profilePic || "",
    email: v?.email || "",
    skillsPossessed: v?.skillsPossessed || [],
  });
  const mapEventForFrontend = (event) => {
    const volunteers = Array.isArray(event?.volunteers)
      ? event.volunteers.map(mapVolunteer)
      : [];
    return {
      _id: event._id,
      title: event.title,
      description: event.description,
      longDescription: event.longDescription || event.description,
      date: event.date,
      time: event.timings,
      timings: event.timings,
      category: event.category || "General",
      organization: {
        name: event.ngoId?.name || "NGO",
        logo: event.ngoId?.logo || "",
        rating: 4.8, // placeholder until you add rating in NGO schema
        eventsCount: Array.isArray(event.ngoId?.eventsPosted) ? event.ngoId.eventsPosted.length : 0,
        joinedDate: event.ngoId?.createdAt
          ? String(new Date(event.ngoId.createdAt).getFullYear())
          : "",
      },
      ngoId: event.ngoId, // keep raw too (for flexibility)
      skillsRequired: event.skillsRequired || [],
      volunteers,
      maxVolunteers: event.maxVolunteers,
      currentVolunteers: volunteers.length,
      location: {
        address: event.location || "",
        coordinates: event.coordinates || { lat: 0, lng: 0 },
      },
      requirements: event.requirements?.length ? event.requirements : defaultRequirements,
      benefits: event.benefits?.length ? event.benefits : defaultBenefits,
      images: [event.image || ""],
      image: event.image || "",
    };
  };

const eventPopulate = [
  { path: "ngoId", select: "name email logo location website briefDescription eventsPosted createdAt" },
  { path: "volunteers", select: "fullname email profilePic skillsPossessed" },
]
  

export const addEvent = async (req, res) => {
  const {
    title,
    description,
    longDescription,
    category,
    location,
    date,
    timings,
    maxVolunteers,
    skillsRequired,
    requirements,
    benefits,
  } = req.body;
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
            longDescription: longDescription || description,
            category: category || "General",
            location,
            date,
            timings,
            image: image?.secure_url || "",
            imageId: image?.public_id || "",
            ngoId: req.user._id,
            skillsRequired: normalizeArrayField(skillsRequired, []),
            requirements: normalizeArrayField(requirements, defaultRequirements),
            benefits: normalizeArrayField(benefits, defaultBenefits),
            maxVolunteers: Number(maxVolunteers),
      
        });
        await NGO.findByIdAndUpdate(req.user._id, {
  $addToSet: { eventsPosted: event._id }
});

const populated = await Event.findById(event._id).populate("ngoId");

return res.status(201).json(mapEventForFrontend(populated));
    } catch (error) {
      console.log(`Error in adding event : ${error}`);
      return res.status(500).json({ message: error?.message || "Internal error in adding event" });
    }
  };
  
export const getAllEvents=async(_, res)=>{
    try{
        const events= await Event.find({})
        .populate(eventPopulate)
        .sort({createdAt:-1})

        return res.status(200).json(events.map(mapEventForFrontend))
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
    .populate(eventPopulate)
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    return res.status(200).json(mapEventForFrontend(event))
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
      .populate(eventPopulate)
      .sort({ createdAt: -1 })
    return res.status(200).json(events.map(mapEventForFrontend))
  } catch (error) {
    console.log(`Error in getting NGO events : ${error}`)
    return res.status(500).json({ message: "Internal error in fetching NGO events" })
  }
}

export const updateEvent = async (req, res) => {
  const { id } = req.params
  const {
    title,
    description,
    longDescription,
    category,
    location,
    date,
    timings,
    maxVolunteers,
    skillsRequired,
    requirements,
    benefits,
  } = req.body

  try {
    if (req.role !== "ngo") {
      return res.status(403).json({ message: "Only NGOs can update events" })
    }

    const event = await Event.findById(id)
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }
    if (event.ngoId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" })
    }

    let imageData = null
    const imageLocalPath = req.files?.image?.[0]?.path
    if (imageLocalPath) {
      imageData = await uploadOnCloudinary(imageLocalPath)
      if (!imageData?.secure_url) {
        return res.status(500).json({ message: "Failed to upload event image" })
      }
    }

    if (title !== undefined) event.title = title
    if (description !== undefined) event.description = description
    if (longDescription !== undefined) event.longDescription = longDescription
    if (category !== undefined) event.category = category
    if (location !== undefined) event.location = location
    if (date !== undefined) event.date = date
    if (timings !== undefined) event.timings = timings
    if (maxVolunteers !== undefined) event.maxVolunteers = Number(maxVolunteers)
    if (skillsRequired !== undefined) event.skillsRequired = normalizeArrayField(skillsRequired, [])
    if (requirements !== undefined) event.requirements = normalizeArrayField(requirements, defaultRequirements)
    if (benefits !== undefined) event.benefits = normalizeArrayField(benefits, defaultBenefits)
    if (imageData?.secure_url) {
      event.image = imageData.secure_url
      event.imageId = imageData.public_id || ""
    }

    await event.save()
    const updatedEvent = await Event.findById(id).populate(eventPopulate)
    return res.status(200).json(mapEventForFrontend(updatedEvent))
  } catch (error) {
    console.log(`Error in updating event : ${error}`)
    return res.status(500).json({ message: error?.message || "Internal error in updating event" })
  }
}

export const deleteEvent = async (req, res) => {
  const { id } = req.params
  try {
    if (req.role !== "ngo") {
      return res.status(403).json({ message: "Only NGOs can delete events" })
    }

    const event = await Event.findById(id)
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }
    if (event.ngoId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" })
    }

    await Event.findByIdAndDelete(id)
    await NGO.findByIdAndUpdate(event.ngoId, { $pull: { eventsPosted: event._id } })
    return res.status(200).json({ message: "Event deleted successfully" })
  } catch (error) {
    console.log(`Error in deleting event : ${error}`)
    return res.status(500).json({ message: "Internal error in deleting event" })
  }
}
