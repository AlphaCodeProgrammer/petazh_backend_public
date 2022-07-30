const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const OrderSchema = new Schema({
    specialId: {
        type: String,
        required: true,
        unique: true
    },
    validRejectionData: {
        type: Date,
        default: Date.now
    },

    orderDate: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        required: true
    },
    sellersId: {
        type: Array,
        default: [],
        required: true
    },
    sendAddress: {
        type: Object,
        required: true
    },
    sendTime: {
        type: Object,
        required: true
    },
    productsList: {
        type: Array,
        default: [],
        required: true
    },
    sendPrice: {
        type: Number,
        default: 0
    },
    totalWeight: {
        type: Number,
        default: 10
    },
    accepteByAllSellers: {
        type: Boolean,
        default: false
    },
    declinedAnySeller: {
        type: Boolean,
        default: false
    },
    declinedSellersArray: {
        type: Array,
        default: []
    },
    deleteOrderByUser: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: true
    },
    payment: {
        type: Number,
        default: 0,
    },
    postManSending: {
        type: Boolean,
        default: false
    },
    petazhPost: {
        type: Boolean,
        default: false
    },
    didNotSeenSellers: {
        type: Array,
        default: [],
    },
    recivedByUser: {
        type: Boolean,
        default: false
    },
    rejection: {
        type: Boolean,
        default: false
    },

    finishedProcess: {
        type: Boolean,
        default: false
    },
    rated: {
        type: Boolean,
        default: false
    },



}, { versionKey: false });

module.exports = mongoose.model("Order", OrderSchema);







