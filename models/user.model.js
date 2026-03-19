import mongoose from 'mongoose'
import Event from './event.model.js'
import NGO from "./ngo.model.js"

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minLength: 6
        },
        phoneNumber: {
            type: String,
            required: true
        },
        address: {
            type: String
        },
        eventsRegistered: [
        {
            type: Schema.Types.ObjectId,
            ref: "Event"
        }
    ],
    }, {timestamps: true}
)

const User = mongoose.model("User", userSchema)
export default User