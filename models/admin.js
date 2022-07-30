
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AdminSchema = new Schema({
    phone:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    favoriteBarbers:[String],
    favoriteUsers:[String],
    favoriteStylists:[String],

    percentOffCustomers:{
        type:Number,
        default:0
    },
    commissionPerTurn:{
      type:Number,
      default:5
    },

    // offCode برای زمانی که ما از طرف خودمان میخواهیم تخفیف دهیم به  مردم یا به هر کس از طرف درآمد خوده موکات
    offCode:{
        code:{
            type:String, 
            default:""
        },
        enable:{
            type:Boolean,
            default:false
        },
        percentageOfCode:{
            type:Number,
            default:0
        }

    }






}, { versionKey: false });
module.exports = mongoose.model('Admin', AdminSchema);


    