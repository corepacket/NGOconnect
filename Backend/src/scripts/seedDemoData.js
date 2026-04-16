import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import mongoose from "mongoose"
import { connectDB } from "../lib/db.js"
import NGO from "../models/ngo.model.js"
import Event from "../models/event.model.js"
import User from "../models/user.model.js"

dotenv.config({ path: "./.env" })

const ngoSeed = [
  {
    name: "Green Earth Collective",
    email: "greenearth@example.com",
    password: "demo123",
    contactNumber: "9876543210",
    location: "Pune, Maharashtra",
    website: "https://greenearth.example.com",
    briefDescription: "Community drives for clean neighborhoods, river care, and urban sustainability.",
    logo: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Teach Forward Foundation",
    email: "teachforward@example.com",
    password: "demo123",
    contactNumber: "9123456780",
    location: "Mumbai, Maharashtra",
    website: "https://teachforward.example.com",
    briefDescription: "Weekend teaching workshops, reading clubs, and youth mentorship programs.",
    logo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Health Reach Trust",
    email: "healthreach@example.com",
    password: "demo123",
    contactNumber: "9988776655",
    location: "Nashik, Maharashtra",
    website: "https://healthreach.example.com",
    briefDescription: "Accessible health camps, awareness sessions, and support for underserved communities.",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=500&q=80",
  },
]

const volunteerSeed = [
  {
    fullname: "Aarav Mehta",
    email: "aarav@example.com",
    password: "demo123",
    phoneNumber: "9000011111",
    address: "Kothrud, Pune",
    skillsPossessed: ["Event Management", "Public Speaking"],
  },
  {
    fullname: "Siya Patel",
    email: "siya@example.com",
    password: "demo123",
    phoneNumber: "9000022222",
    address: "Andheri, Mumbai",
    skillsPossessed: ["Teaching", "Writing"],
  },
]

const eventSeed = [
  {
    ngoEmail: "greenearth@example.com",
    title: "River Cleanup Morning Drive",
    description: "Help clean the riverfront and sort collected waste for recycling.",
    longDescription: "Join our guided cleanup drive to restore the local riverfront, improve public spaces, and inspire eco-conscious action in the neighborhood.",
    category: "Environment",
    location: "Mula River Walk, Pune",
    dateOffsetDays: 4,
    timings: "7:30 AM - 11:30 AM",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80",
    skillsRequired: ["Teamwork", "Physical Fitness"],
    requirements: ["Wear comfortable clothes", "Carry a water bottle"],
    benefits: ["Cleanup certificate", "Community service hours"],
    maxVolunteers: 35,
  },
  {
    ngoEmail: "greenearth@example.com",
    title: "Tree Plantation Weekend",
    description: "Plant native saplings and help maintain a new green patch in the city.",
    longDescription: "Volunteers will assist with soil preparation, planting, watering, and documenting the plantation effort for future maintenance drives.",
    category: "Community",
    location: "Baner Hill, Pune",
    dateOffsetDays: 10,
    timings: "8:00 AM - 12:00 PM",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80",
    skillsRequired: ["Teamwork"],
    requirements: ["Sun protection recommended"],
    benefits: ["Hands-on environmental action", "Networking with local volunteers"],
    maxVolunteers: 25,
  },
  {
    ngoEmail: "teachforward@example.com",
    title: "Math Support Workshop",
    description: "Support school students with maths basics and activity-led learning.",
    longDescription: "This classroom support session pairs volunteers with small student groups to improve confidence, curiosity, and problem-solving skills.",
    category: "Education",
    location: "Dharavi Learning Center, Mumbai",
    dateOffsetDays: 6,
    timings: "2:00 PM - 5:00 PM",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
    skillsRequired: ["Teaching", "Patience"],
    requirements: ["Comfortable working with children"],
    benefits: ["Teaching experience", "Volunteer recognition"],
    maxVolunteers: 18,
  },
  {
    ngoEmail: "teachforward@example.com",
    title: "Reading Club Mentor Session",
    description: "Guide children through storytelling, reading practice, and discussions.",
    longDescription: "Mentors will facilitate reading circles, pronunciation practice, and confidence-building activities for young learners.",
    category: "Education",
    location: "Chembur Community Hall, Mumbai",
    dateOffsetDays: 13,
    timings: "11:00 AM - 1:30 PM",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    skillsRequired: ["Writing", "Public Speaking"],
    requirements: ["Basic English reading fluency"],
    benefits: ["Mentoring experience", "Community impact certificate"],
    maxVolunteers: 20,
  },
  {
    ngoEmail: "healthreach@example.com",
    title: "Community Health Awareness Camp",
    description: "Assist with registrations, guidance desks, and awareness activities.",
    longDescription: "Support our outreach team as we welcome patients, organize queues, and help visitors navigate awareness sessions and basic screenings.",
    category: "Health",
    location: "CIDCO Ground, Nashik",
    dateOffsetDays: 8,
    timings: "9:00 AM - 2:00 PM",
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1200&q=80",
    skillsRequired: ["First Aid", "Event Management"],
    requirements: ["Able to stand for longer durations"],
    benefits: ["Health outreach exposure", "Volunteer badge"],
    maxVolunteers: 30,
  },
]

const addDays = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

const seed = async () => {
  try {
    await connectDB()

    const ngoMap = new Map()
    for (const ngoData of ngoSeed) {
      const existing = await NGO.findOne({ email: ngoData.email })
      const hashedPassword = existing?.password || (await bcrypt.hash(ngoData.password, 10))
      const ngo = await NGO.findOneAndUpdate(
        { email: ngoData.email },
        {
          ...ngoData,
          password: hashedPassword,
          logoId: "",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
      ngoMap.set(ngoData.email, ngo)
    }

    for (const userData of volunteerSeed) {
      const existing = await User.findOne({ email: userData.email })
      const hashedPassword = existing?.password || (await bcrypt.hash(userData.password, 10))
      await User.findOneAndUpdate(
        { email: userData.email },
        {
          ...userData,
          password: hashedPassword,
          profilePic: "",
          profilePicId: "",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    }

    for (const eventData of eventSeed) {
      const ngo = ngoMap.get(eventData.ngoEmail)
      if (!ngo) continue

      const event = await Event.findOneAndUpdate(
        { title: eventData.title, ngoId: ngo._id },
        {
          title: eventData.title,
          description: eventData.description,
          longDescription: eventData.longDescription,
          category: eventData.category,
          location: eventData.location,
          date: addDays(eventData.dateOffsetDays),
          timings: eventData.timings,
          image: eventData.image,
          imageId: "",
          ngoId: ngo._id,
          skillsRequired: eventData.skillsRequired,
          requirements: eventData.requirements,
          benefits: eventData.benefits,
          maxVolunteers: eventData.maxVolunteers,
          volunteers: [],
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )

      await NGO.findByIdAndUpdate(ngo._id, { $addToSet: { eventsPosted: event._id } })
    }

    console.log("Demo NGOs, volunteers, and events seeded successfully.")
    console.log("Demo NGO login: greenearth@example.com / demo123")
    console.log("Demo volunteer login: aarav@example.com / demo123")
  } catch (error) {
    console.error("Failed to seed demo data:", error)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
  }
}

seed()
