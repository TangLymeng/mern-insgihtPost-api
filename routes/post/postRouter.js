const express = require("express");
const multer = require("multer");
const {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  getPublicPosts,
  likePost,
  disLikePost,
  claps,
  schedule,
  postViewCount,
} = require("../../controllers/posts/posts");

const isLoggin = require("../../middlewares/isLoggin");
const storage = require("../../utils/fileUpload");

const postsRouter = express.Router();

// file upload middleware
const upload = multer({ storage });

//create
postsRouter.post("/", isLoggin, upload.single("file"), createPost);

//get public posts only 4 posts
postsRouter.get("/public", getPublicPosts);

//get all
postsRouter.get("/", isLoggin, getAllPosts);

//get single post
postsRouter.get("/:id", getPost);

//update post
postsRouter.put("/:id", isLoggin, upload.single("file"), updatePost);

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

//post views
postsRouter.put("/:id/post-view-count", isLoggin, postViewCount);

module.exports = postsRouter;
