const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const checkoutOrderSchema = new Schema({
    orderId: {
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    sellerId: {
        type: String,
        required: true,
    },
    speceficOrderId: {
        type: String,
        required: true,
    },
    productsList: {
        type: Array,
        required: [],
    },
    paymentValue: {
        type: Number,
        required: true,
        default: 0
    },
    withdrawTime: {
        type: Date,
        default: Date.now
    },
    show: {
        type: Boolean,
        default: true
    },
    checkedOut: {
        type: Boolean,
        default: false
    },
    rejectionPart: {
        type: Boolean,
        default: false
    }
}, { versionKey: false });
module.exports = mongoose.model("checkoutOrder", checkoutOrderSchema);
