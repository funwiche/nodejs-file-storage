const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Upload",
  new mongoose.Schema(
    {
      _id: { type: String, required: true },
      file: { type: String, required: true },
      field: { type: String, required: true },
      mimetype: { type: String, required: true },
    },
    { timestamps: true }
  )
);
