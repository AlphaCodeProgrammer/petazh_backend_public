const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userPaymentSchema = new Schema({
    createDate: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true

    },
    trackingNumber: {
        type: String,
        required: true,
        unique: true

    },
    paid: {
        type: Number,
        default: 0,
        required: true,
    },

}, { versionKey: false });
module.exports = mongoose.model("userPayment", userPaymentSchema);
