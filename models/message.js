const mongoose = require("mongoose");
const user = require("./user");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, require: true },
  body: { type: String, require: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now, require: true},
});

MessageSchema.virtual("url").get(function () {
  return `/messages/${this._id}`;
});

module.exports = mongoose.model("Message", MessageSchema);
