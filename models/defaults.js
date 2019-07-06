const mongoose = require("mongoose");

const { Schema } = mongoose;

const defaultsSchema = new Schema({
  chatId: {
    type: Number,
    required: true
  },
  autoConvertTemp: {
    type: Boolean,
    required: true,
    default: false
  },
  autoConvertWeight: {
    type: Boolean,
    required: true,
    default: false
  }
});

const Defaults = mongoose.model("Defaults", defaultsSchema);
module.exports = Defaults;
