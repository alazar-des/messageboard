const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_name: { type: String, require: true },
  password: { type: String, require: true },
  membership_status: { type: String },
  avator: { type: String },
});

UserSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

module.exports = mongoose.model("User", UserSchema);
