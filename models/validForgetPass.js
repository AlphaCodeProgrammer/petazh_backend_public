const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const validForgetPassOtpSchema = new Schema({
  phone: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, expires: "4m", default: Date.now },
}, { versionKey: false });
module.exports = mongoose.model("validForgetPassOtp", validForgetPassOtpSchema);
