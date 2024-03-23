const asyncHandler = require("express-async-handler");
const Category = require("../../model/Category/Category");
const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");

//@desc  Create a post
//@route POST /api/v1/posts
//@access Private

exports.createPost = asyncHandler(async (req, res) => {
  //Get the payload
  const { title, content, categoryId } = req.body;
  //chech if post exists
  const postFound = await Post.findOne({ title });
  if (postFound) {
    throw new Error("Post aleady exists");
  }
  //Create post
  const post = await Post.create({
    title,
    content,
    category: categoryId,
    author: req?.userAuth?._id,
  });
  //!Associate post to user
  await User.findByIdAndUpdate(
    req?.userAuth?._id,
    {
      $push: { posts: post._id },
    },
    {
      new: true,
    }
  );

  //* Push post into category
  await Category.findByIdAndUpdate(
    categoryId,
    {
      $push: { posts: post._id },
    },
    {
      new: true,
    }
  );
  //? send the response
  res.json({
    status: "scuccess",
    message: "Post Succesfully created",
    post,
  });
});

//@desc  Get all posts
//@route GET /api/v1/posts
//@access Private

exports.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("category").populate("author").populate("comments");
  res.json({
    status: "success",
    message: "All posts",
    posts,
  });
});

//@desc  Get only 4 posts
//@route GET /api/v1/posts
//@access PUBLIC

exports.getPublicPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 }).limit(4);
  res.status(200).json({
    status: "success",
    message: "Posts successfully fetched",
    posts,
  });
});

//@desc  Get a post
//@route GET /api/v1/posts/:id
//@access Public

exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Post successfully fetched",
    post,
  });
});

//@desc  Update a post
//@route PUT /api/v1/posts/:id
//@access Private

exports.updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: "success",
    message: "post successfully updated",
    post,
  });
});

//@desc  Delete Post
//@route DELETE /api/v1/posts/:id
//@access Private

exports.deletePost = asyncHandler(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Post successfully deleted",
  });
});