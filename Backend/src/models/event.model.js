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

    date:{
        type:Date,
        required:true
    },

    ngoId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"NGO",
        required:true
    },

    category:{
        type:String,
        required:true
    },

   skillsRequired: [
    {
      type: String
    }
  ],

  maxVolunteers: {
    type: Number
  },

  volunteers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
}, {timestamps: true});

eventSchema.index({"location.city":1});
eventSchema.index({category:1});
eventSchema.index({ skillsRequired: 1 });

const Event = mongoose.model("Event",eventSchema)
export default Event