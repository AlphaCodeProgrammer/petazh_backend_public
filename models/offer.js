
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OfferSchema = new Schema({
    emailOrPhone:{
        type:String,
        required:true
    },
    offerContent:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: new Date().toISOString()
    }
 



}, { versionKey: false });
module.exports = mongoose.model('Offer', OfferSchema);