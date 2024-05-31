const asyncHandler = require("express-async-handler");
const Tag = require('../../model/Tag/Tag');


// Create a new tag
const createTag = asyncHandler (async(req, res) => {
  try {
    const tag = new Tag(req.body);
    await tag.save();
    res.status(201).send(tag);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all tags
const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).send(tags);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a tag
const updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tag) {
      return res.status(404).send();
    }
    res.send(tag);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a tag
const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) {
      return res.status(404).send();
    }
    res.send(tag);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createTag, getAllTags, updateTag, deleteTag };
