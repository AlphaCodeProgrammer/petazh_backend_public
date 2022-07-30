
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cancelOrderSchema = new Schema({
    orderId: {
        type: String,
        default: "",
        unique: true
    },
   
    payment: {
        type: Number,
        default: ""
    },
    paid: {
        type: Boolean,
        default: false
    },
    userId: {
        type: String,
        default: ""

    },
    date: {
        type: Date,
        default: Date.now
    }




}, { versionKey: false });
module.exports = mongoose.model('cancelOrder', cancelOrderSchema);