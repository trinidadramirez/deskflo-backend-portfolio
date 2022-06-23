const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
    maxLength: 100,
    required: true,
  },
  email: {
    type: String,
    maxLength: 100,
    required: true,
  },
  password: {
    type: String,
    minLength: 10,
    maxLength: 100,
    required: true,
  },
});

module.exports = {
  UserSchema: mongoose.model("User", UserSchema),
};
