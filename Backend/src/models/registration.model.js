import mongoose, {Schema} from 'mongoose'

const registrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    required: true
  },

  message: {
    type: String,
    required: true
  },

  appliedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });



registrationSchema.index(
  { userId: 1, eventId: 1 },
  { unique: true }
);

const Registration = mongoose.model("Registration", registrationSchema)
export default Registration