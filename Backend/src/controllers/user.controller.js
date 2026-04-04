import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import {generateToken} from "../lib/utils.js"

export const signup = async (req, res) => {
    try{
        const {fullname, email, password, phoneNumber} = req.body

        if(!fullname || !email || !password || !phoneNumber){
            return res.status(400).json({message:"All fields are required"})
        }

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({message: "User with email already exists"})
        }

        if(password.length<6){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            phoneNumber,
            address : req.body.address || ""
        })

        generateToken(user._id,res)

        return res.status(201).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber
        })
    } 
    catch(error){
        console.log(`Error in registering user ${error}`)
        return res.status(500).json({message: "Internal error in registering user"})
    }

}