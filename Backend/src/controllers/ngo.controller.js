import { generateToken } from "../lib/utils.js"
import bcrypt from bcryptjs
import NGO from "../models/ngo.model.js"

export const registerNGO = async(req, res) => {
    const {name, email, password, contactNumber, location} = req.body

    try{
        if(!name || !email || !password || !contactNumber || !location){
            return res.status(400).json({message: "All fields are required"})
        }

        if(password.length<6){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }

        if(phoneNumber.length!=10){
            return res.status(400).json({message: "Phone number should be of 10 digits"})
        }

        const salt = await bcrypt.genSlat(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const ngo = await NGO.create({
            name,
            email,
            password: hashedPassword,
            contactNumber,
            location
        })

        generateToken(ngo._id, "ngo", res)

        return res.status(201).json({
            _id: ngo._is,
            name: ngo.name,
            email: ngo.email,
            contactNumber: ngo.contactNumber
        })
    }
    catch(error){
        console.log(`Error in registering NGO : ${error}`)
        return res.status(500).json({message: "Internal server error in registering NGO"})
    }
}