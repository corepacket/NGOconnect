import mongoose, {Schema} from "mongoose"

const pastEventSchema = new mongoose.Schema(
  {
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    location: {
      type: String,
      required: true
    },
    date:{
        type:Date,
        required:true
    },
    timings: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    imageId: {
      type: String
    },
    ngoId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"NGO",
        required:true
    },
    skillsRequired: [
    {
      type: String
    }
  ],
  maxVolunteers: {
    type: Number,
    required: true
  }
}, {timestamps: true})

pastEventSchema.index({location:1});
pastEventSchema.index({category:1});
pastEventSchema.index({ skillsRequired: 1 });

const PastEvent = mongoose.model("PastEvent",pastEventSchema)
export default PastEvent