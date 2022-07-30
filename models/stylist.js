const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StylistSchema = new Schema({
  stylistPhone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    default: "lashfr8ay$5sfh%8safsGs947HFhdGdMnvbOer1@dh&"
  },
  stylistName: {
    type: String,
    default: "",
  },
  stylistLastName: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  wallet: {
    type: Number,
    default: 0,
  },
  sheba: {
    type: String,
    default: "",
  },
  stylistPhoto: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1531831108325-7fe9616bc780?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z2VudGxlbWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=400&q=60",
  },

  show: {
    type: Boolean,
    default: false,
  },
  ban: {
    type: Boolean,
    default: false,
  },
  rating: {
    greeting: {
      quantity: {
        type: Number,
        default: 1
      },
      rate: {
        type: Number,
        default: 5
      },
    },
    matching: {
      quantity: {
        type: Number,
        default: 1
      },
      rate: {
        type: Number,
        default: 5
      },
    },
    satisfaction: {
      quantity: {
        type: Number,
        default: 1
      },
      rate: {
        type: Number,
        default: 5
      },
    },
  },
  registeredBy: {
    type: String,
    default: "",
  },

  services: {
    type: Array,
  },
  referralCode: {
    type: String,
    default: "",
  },
  registerTime: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false });

module.exports = mongoose.model("Stylist", StylistSchema);


