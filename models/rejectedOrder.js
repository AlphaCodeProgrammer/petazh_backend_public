
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const rejectedOrderSchema = new Schema({
    orderId: {
        type: String,
        default: "",
        unique: true
    },
    rejectedProducts: {
        type: Array,
        default: []
    },
    userId: {
        type: String,
        default: ""
    },
    acceptedByPetazh: {
        type: Boolean,
        default: false
    },
    checkedByPetazh: {
        type: Boolean,
        default: false
    },
    rejectedByPetazh: {
        type: Boolean,
        default: false
    },
    answer: {
        type: String,
        default: ""
    },
    sendAddress: {
        type: Object,
        required: true
    },
    explain: {
        type: String,
        default: ""
    },

    specialId: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now
    }




}, { versionKey: false });
module.exports = mongoose.model('rejectedOrder', rejectedOrderSchema);