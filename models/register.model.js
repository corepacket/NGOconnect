const mongoose = require("mongoose");
import User from "./user.model.js"
import NGO from "./ngo.model.js"

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
    default: "pending"
  },

  message: {
    type: String 
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
const register = mongoose.model("Registration", registrationSchema);
export default register;