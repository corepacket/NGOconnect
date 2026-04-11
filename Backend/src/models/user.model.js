import mongoose, {Schema} from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        fullname: {
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
        profilePic: {
            type: String,
            required: true
        },
        profilePicId: {
            type: String,
            required: true
        },
        skillsPossessed: [
            {
                type: String,
                enum: ["Teaching","Healthcare","Environmental Conservation","Animal Care","Event Management","Fundraising","Social Media","Web Development","Graphic Design","Photography","Writing","Public Speaking","First Aid","Counselling","Legal Aid","Research"],
                required: true
            }
        ],
        savedEvents: [
            {
                type: Schema.Types.ObjectId,
                ref: "Event"
            }
        ]
    }, {timestamps: true}
)

const User = mongoose.model("User", userSchema)
export default User