const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const _ = require("lodash");

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "User"],
      default: "User",
    },
  },
  { timestamps: true }
);

// User toJSON
userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  return _.pick(userObj, "_id", "name", "email", "role");
};

module.exports = mongoose.model("User", userSchema);
