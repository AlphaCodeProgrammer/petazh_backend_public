
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SellerSchema = new Schema({
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        default: "fhsdfhfhosfhfhsdf"
    },
    sheba: {
        type: String,
        default: ""
    },
    shopName: {
        type: String,
        default: ""
    },
    rating: {
        type: Array,
        default: [5]
    },
    shopCity: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    postalCode: {
        type: String,
        default: ""
    },
    Images: {
        type: Array,
        default: []
    },
    show: {
        type: Boolean,
        default: false
    },
    ban: {
        type: Boolean,
        default: false
    },

}, { versionKey: false });

module.exports = mongoose.model("Seller", SellerSchema);
