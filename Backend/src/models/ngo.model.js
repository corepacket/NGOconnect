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
        website: {
            type: String,
            required: true
        },
        briefDescription: {
            type: String,
            required: true
        },
        logo: {
            type: String
        },
        logoId: {
            type: String
        }
    }, {timestamps: true}
)

const NGO = mongoose.model("NGO", ngoSchema)
export default NGO