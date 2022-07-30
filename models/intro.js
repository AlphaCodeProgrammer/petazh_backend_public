
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const IntroSchema = new Schema({
    emailOrPhone:{
        type:String,
    },
    introType:{
        type:String,
        default:""
    },
    IntroContent:{
        type:String,
    },
    date:{
        type:Date,
        default: new Date().toISOString()
    }
 



}, { versionKey: false });
module.exports = mongoose.model('Intro', IntroSchema);