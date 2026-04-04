import mongoose, {Schema} from 'mongoose'

const ngoSchema = new mongoose.Schema(
    {
        name: {
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
        contactNumber: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        eventsPosted: [
        {
            type: Schema.Types.ObjectId,
            ref: "Event"
        }
    ],
    }, {timestamps: true}
)

const NGO = mongoose.model("NGO", ngoSchema)
export default NGO