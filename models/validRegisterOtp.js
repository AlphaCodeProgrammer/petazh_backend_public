const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const validRegisterOtpSchema = new Schema({
  phone: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, expires: "6m", default: Date.now },
}, { versionKey: false });
module.exports = mongoose.model("validRegisterOtp", validRegisterOtpSchema);
