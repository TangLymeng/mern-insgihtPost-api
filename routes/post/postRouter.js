const express = require("express");
const { createPost, getAllPosts, getPost, updatePost, deletePost, getPublicPosts } = require("../../controllers/posts/posts");

const isLoggin = require("../../middlewares/isLoggin");

const postsRouter = express.Router();

//create
postsRouter.post("/", isLoggin, createPost);

//get all
postsRouter.get("/", isLoggin, getAllPosts);

//get single post
postsRouter.get("/:id", getPost);

//update post
postsRouter.put("/:id", isLoggin, updatePost);

//delete post
postsRouter.delete("/:id", isLoggin, deletePost);

//get public posts only 4 posts
postsRouter.get("/public", getPublicPosts);

module.exports = postsRouter;