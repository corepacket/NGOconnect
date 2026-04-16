import mongoose, {Schema} from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    longDescription:{
      type:String,
      required:true
    },
    category: {
      type: String,
      default: "General",
    },
    location: {

      type: String,
      required: true
    },
    coordinates:{
      lat:{type:Number,default:0},
      lng:{type:Number,default:0},
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
      type: String,
      default:""
    },
    imageId: {
      type: String,
      default:""
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
<<<<<<< HEAD
=======

  requirements:[{type:String}],

  benefits:[{type:String}],
  

>>>>>>> f3a6fc8f889dddd32d507f038a41d6a32157b48d
  maxVolunteers: {
    type: Number,
    required: true
  }
}, {timestamps: true});

eventSchema.index({location:1});
eventSchema.index({ skillsRequired: 1 });

const Event = mongoose.model("Event",eventSchema)
export default Event