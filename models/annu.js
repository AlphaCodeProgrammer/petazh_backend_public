const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const annuSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    annPostDate:{
        type:Date,
        default: new Date().toISOString()
    },
    readed:{
        type:Array,
        default:["start"]
    }


}, { versionKey: false });

module.exports = mongoose.model("Annu", annuSchema);
