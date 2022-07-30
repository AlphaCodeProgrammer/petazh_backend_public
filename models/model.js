const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelSchema = new Schema ({
  
    type:{
        type:String,
        required:true,
    },
    code:{
        type:String,
        required:true,
    },
    sideImage:{
        type:Array,
    },
    forMen: {
        type:Boolean,
        required:true,
    },

}, { versionKey: false });

module.exports= mongoose.model("Model", ModelSchema);

