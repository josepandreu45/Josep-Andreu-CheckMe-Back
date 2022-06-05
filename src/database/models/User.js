const { Schema, model, SchemaTypes } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    require: true,
  },

  username: {
    type: String,
    require: true,
    unique: true,
  },

  password: {
    type: String,
    require: true,
  },
  checks: {
    type: [{ type: SchemaTypes.ObjectId, ref: "Check" }],
    default: [],
  },
});

const User = model("User", UserSchema, "users");
module.exports = User;
