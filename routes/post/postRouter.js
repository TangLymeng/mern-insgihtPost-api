const express = require("express");
const { createPost, getAllPosts, getPost, updatePost, deletePost, getPublicPosts, likePost, disLikePost, claps, schedule } = require("../../controllers/posts/posts");

const isLoggin = require("../../middlewares/isLoggin");

const postsRouter = express.Router();

//create
postsRouter.post("/", isLoggin, createPost);

//get public posts only 4 posts
postsRouter.get("/public", getPublicPosts);

//get all
postsRouter.get("/", isLoggin, getAllPosts);

//get single post
postsRouter.get("/:id", getPost);

//update post
postsRouter.put("/:id", isLoggin, updatePost);

//delete post
postsRouter.delete("/:id", isLoggin, deletePost);

//like post
postsRouter.put("/likes/:id", isLoggin, likePost);

//schedule post
postsRouter.put("/schedule/:postId", isLoggin, schedule);

//dislike post
postsRouter.put("/dislikes/:id", isLoggin, disLikePost);

//claps
postsRouter.put("/claps/:id", isLoggin, claps);

module.exports = postsRouter;