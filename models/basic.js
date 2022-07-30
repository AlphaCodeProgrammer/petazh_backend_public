
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BasicSchema = new Schema({
    specialId: {
        type: String,
        default: "petazh"
    },

    basicInfo: {
        type: Object,
        default:
        {
            "filterProducts": [
                {
                    "group": "",
                    "brands": [
                        { "brandName": "", "english": "" }
                    ],
                    "category": [

                    ]
                }
            ],
            "addProductsInfo":{
                type:Array,
                default:[]
            },
            "brands":{
                type:Array,
                default:[]
            },
            "brandsForFilter":{
                type:Array,
                default:[]
            },
            "appPictures": {
                "carousel": [],
                "gallery": [],
                "icons": [],
                "logos": []
            },
        }

    },


}, { versionKey: false });

module.exports = mongoose.model("Basic", BasicSchema);
