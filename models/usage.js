const mongoose = require("mongoose");

const { Schema } = mongoose;

const usageSchema = new Schema({
  chatId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: false
  },
  command: {
    type: String,
    required: false
  },
  submitted: {
    type: Date,
    required: true,
    default: new Date()
  }
});

const Usage = mongoose.model("Usage", usageSchema);
module.exports = Usage;
