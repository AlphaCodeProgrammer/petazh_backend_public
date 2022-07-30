const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OtpSchema = new Schema({
  phone: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  
  createdAt: { type: Date, expires: "3m", default: Date.now },
}, { versionKey: false });
module.exports = mongoose.model("Otp", OtpSchema);
