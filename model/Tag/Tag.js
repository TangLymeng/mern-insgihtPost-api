const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
  });
//compile schema to  model

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;