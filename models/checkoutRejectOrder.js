const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const checkoutRejectedOrderSchema = new Schema({
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

    productsList: {
        type: Array,
        required: [],
    },
    paymentValue: {
        type: Number,
        required: true,
        default: 0
    },
    checkedOut: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: true
    },
    solved: {
        type: Boolean,
        default: false
    }

}, { versionKey: false });
module.exports = mongoose.model("checkoutRejectedOrder", checkoutRejectedOrderSchema);
