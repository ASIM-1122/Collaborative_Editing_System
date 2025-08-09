const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    require: true,
    minLength: 3,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require:true,
    minLength: 4,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Users", userSchema);
