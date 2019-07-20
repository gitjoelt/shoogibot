const mongoose = require("mongoose");

const { Schema } = mongoose;

const remindSchema = new Schema({
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
  reminder: {
    type: String,
    required: true
  },
  triggerdate: {
    type: String,
    required: true
  }
});

const Remind = mongoose.model("Remind", remindSchema);
module.exports = Remind;
