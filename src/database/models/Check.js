const { Schema, model } = require("mongoose");

const CheckSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  times: {
    type: Number,
    default: 1,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});

const Check = model("Check", CheckSchema, "checks");

module.exports = Check;
