// routes/tags.js
const express = require('express');
const isLoggin = require('../../middlewares/isLoggin');
const { createTag, getAllTags, updateTag, deleteTag } = require('../../controllers/tag/tag');

const tagsRouter = express.Router();

// Create a new tag
tagsRouter.post('/', isLoggin, createTag);

// Get all tags
tagsRouter.get('/', getAllTags);

// Update a tag
tagsRouter.put('/:id', isLoggin, updateTag);

// Delete a tag
tagsRouter.delete('/:id', isLoggin, deleteTag);

module.exports = tagsRouter;
