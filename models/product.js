const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        default: ""
    },
    show: {
        type: Boolean,
        default: true
    },
    images: {
        type: Array,
        default: ["https://images.unsplash.com/photo-1571782742478-0816a4773a10?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=60&raw_url=true&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdHN8ZW58MHwxfDB8d2hpdGV8&auto=format&fit=crop&w=500"]
    },
    group: {
        type: String,
        default: "",
    },
    category: {
        type: String,
        default: "",
    },
    subCategory: {
        type: String,
        default: "",
    },
    sellers: {
        type: Array,
        default: [],
    },

    // new added
    weight: {
        type: Number,
        default: 10,
    },
    //new added  وقتی فروشنده داره قیمت رو ثبت میکنه میاد چم میکنه اگه قیمت با آف کمتر باشه اونجا ثبت میکنه برای فیلتر
    lowestPrice: {
        type: Number,
        default: 1000000000,
    },
    date: {
        type: Date,
        default: new Date().toISOString(),
    },
    soldCount: {
        type: Number,
        default: 0,
    },
    exist: {
        type: Boolean,
        default: false,
    },
    brand: {
        type: String,
        default: ""
    },
    info: {
        type: String,
        default: ""
    },
    properties: {

    },
    colors: {
        type: Array,
        default: []
    },
    seen: {
        type: Number,
        default: 0
    },
  
    rating: {
        rate: {
            type: Number,
            default: 5
        },
        quantity: {
            type: Number,
            default: 1
        }
    }

}, { versionKey: false });

module.exports = mongoose.model("Product", ProductSchema);

