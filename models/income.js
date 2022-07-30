const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IncomeSchema = new Schema({
  stylistBalance: {
    type: Number,
    default: 0
  },
  userBalance: {
    type: Number,
    default: 0
  },
  turnInfo: {
    type: Object,
  },

  income: {
    type: Number,
    default: 0,
  },
}, { versionKey: false });

module.exports = mongoose.model("Income", IncomeSchema);
