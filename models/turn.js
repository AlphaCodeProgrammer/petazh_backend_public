const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const TurnSchema = new Schema({
   turnDate: {
      StartIn: {
         type: String,
         default: ''
      },
      duration: {
         type: String,
         default: "",
      },
      EndIn: {
         type: String,
         default: ''
      },
      ColorTurn: {
         type: String,
         default: "black"
      },
      TextToUser: {
         type: String,
         default: 'با درخواست شما موافقت شد'
      },
   },
   username: {
      type: String,
      default: ""
   },
   requestDate: {
      type: String,
      default: Date.now()
   },
   absentUser: {
      type: Boolean,
      default: false
   },
   selfAdded: {
      type: Boolean,
      default: false
   },
   stylistId: {
      type: String,
      required: true
   },
   barberId: {
      type: String,
      required: true
   },
   userId: {
      type: String,
      required: true
   },
   textToStylist: {
      type: String,
      default: ""
   },
   lastModify: {
      type: String,
      default: ""
   },
   services: [],
   totalServicesPrice: {
      type: Number,
      required: true
   },
   floatingPrice: {
      type: Number,
      default: 0
   },
   barberName: {
      type: String,
      default: ""
   },
   Accepted: {
      type: Boolean,
      default: false
   },
   show: {
      type: Boolean,
      default: true
   },

   userChanged: {
      changed: {
         type: Boolean,
         default: false
      },
      rejected: {
         type: Boolean,
         default: false
      },
      time: {
         type: String,
         default: ""
      }
   },
   stylistChanged: {
      changed: {
         type: Boolean,
         default: false
      },
      rejected: {
         type: Boolean,
         default: false
      },
      time: {
         type: String,
         default: ""
      }

   },
   modelImages: [String],
   rated: {
      type: Boolean,
      default: false
   },
   finished: {
      type: Boolean,
      default: false
   },
   endTime: {
      type: String,
      default: ""
   },
   onlinePaid: {
      type: Boolean,
      default: false
   },
   offlinePaid: {
      type: Boolean,
      default: false
   },
   offReferral: {
      type: Boolean,
      default: false
   },
   offMoocutCode: {
      type: String,
      default: ""
   }


}, { versionKey: false });

module.exports = mongoose.model("Turn", TurnSchema);







