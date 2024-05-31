const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose"); // Add this line to require mongoose
const Category = require("../../model/Category/Category");
const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");

//@desc  Create a post
//@route POST /api/v1/posts
//@access Private

//@desc  Create a post
//@route POST /api/v1/posts
//@access Private
exports.createPost = asyncHandler(async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    let tags = req.body.tags;

    console.log("Received data:", { title, content, categoryId, tags });

    // Parse tags if they are sent as a JSON string
    if (typeof tags === "string") {
      tags = JSON.parse(tags);
    }

    // Convert tags to an array if it's a single value
    if (!Array.isArray(tags)) {
      tags = [tags];
    }

    console.log("Converted tags:", tags);

    // Validate categoryId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ message: `Invalid category ID: ${categoryId}` });
    }

    // Check if post exists
    const postFound = await Post.findOne({ title });
    if (postFound) {
      return res.status(400).json({ message: "Post already exists" });
    }

    // Create post
    const post = await Post.create({
      title,
      content,
      category: categoryId,
      author: req?.userAuth?._id,
      image: req?.file?.path,
      tags: tags, // Store tags directly as strings
    });

    // Associate post to user
    await User.findByIdAndUpdate(
      req?.userAuth?._id,
      {
        $push: { posts: post._id },
      },
      {
        new: true,
      }
    );

    // Push post into category
    await Category.findByIdAndUpdate(
      categoryId,
      {
        $push: { posts: post._id },
      },
      {
        new: true,
      }
    );

    res.json({
      status: "success",
      message: "Post successfully created",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//@desc  Get all posts
//@route GET /api/v1/posts
//@access Private

exports.getAllPosts = asyncHandler(async (req, res) => {
  // !find all users who have blocked the logged-in user
  const loggedInUserId = req.userAuth?._id;
  //get current time
  const currentTime = new Date();
  const usersBlockingLoggedInuser = await User.find({
    blockedUsers: loggedInUserId,
  });
  // Extract the IDs of users who have blocked the logged-in user
  const blockingUsersIds = usersBlockingLoggedInuser?.map((user) => user?._id);

  //! Get the category, search term, startDate, and endDate from request
  const { category, searchTerm, startDate, endDate } = req.query;

  let query = {
    author: { $nin: blockingUsersIds },
    $or: [
      {
        shedduledPublished: { $lte: currentTime },
        shedduledPublished: null,
      },
    ],
  };

  //! check if category/searchTerm is specified, then add to the query
  if (category) {
    query.category = category;
  }
  if (searchTerm) {
    query.title = { $regex: searchTerm, $options: "i" };
  }

  // Add date range filter if startDate and endDate are provided
  if (startDate && endDate) {
    query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else if (startDate) {
    query.createdAt = { $gte: new Date(startDate) };
  } else if (endDate) {
    query.createdAt = { $lte: new Date(endDate) };
  }

  console.log("Query:", JSON.stringify(query));  // Add this line to log the query

  // Pagination parameters from request
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.countDocuments(query);

  const posts = await Post.find(query)
    .populate({
      path: "author",
      model: "User",
      select: "email role username profilePicture",
    })
    .populate("category")
    .populate("tags")
    .skip(startIndex)
    .limit(limit);

  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.json({
    status: "success",
    message: "All posts",
    pagination,
    posts,
  });
});


//@desc  Get only 4 posts
//@route GET /api/v1/posts
//@access PUBLIC

exports.getPublicPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .limit(4)
    .populate("category");
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
  const post = await Post.findById(req.params.id)
    .populate("author")
    .populate("category")
    .populate({
      path: "comments",
      model: "Comment",
      populate: {
        path: "author",
        select: "username profilePicture",
      },
    });
  res.status(201).json({
    status: "success",
    message: "Post successfully fetched",
    post,
  });
});

exports.getPostsByTag = async (req, res) => {
  try {
    const tagName = req.params.tagName;

    // Query posts that contain the specified tag
    const posts = await Post.find({ tags: tagName }).populate("category", "name");

    console.log("Posts:", posts);

    // Check if any posts were found
    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No posts found with the specified tag" });
    }

    // Return the posts
    res.json({ posts });
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//@desc  Update a post
//@route PUT /api/v1/posts/:id
//@access Private

exports.updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const postFound = await Post.findById(id);
  if (!postFound) {
    throw new Error("Post not found");
  }

  const { title, category, content } = req.body;
  const tags = req.body.tags ? JSON.parse(req.body.tags) : [];

  // Update post with new data including tags
  const post = await Post.findByIdAndUpdate(
    id,
    {
      image: req.file ? req.file.path : postFound.image,
      title: title || postFound.title,
      category: category || postFound.category,
      content: content || postFound.content,
      tags: tags.length ? tags : postFound.tags,
    },
    {
      new: true,
      runValidators: true,
    }
  );

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
  // find the post
  const postFound = await Post.findById(req.params.id);
  const isAuthor =
    req.userAuth?._id.toString() === postFound?.author?._id.toString();
  if (!isAuthor) {
    throw new Error("Action denied, You are not the author of this post");
  }
  await Post.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Post successfully deleted",
  });
});

//@desc   liking a Post
//@route  PUT /api/v1/posts/likes/:id
//@access Private

exports.likePost = asyncHandler(async (req, res) => {
  //Get the id of the post
  const { id } = req.params;
  //get the login user
  const userId = req.userAuth._id;
  //Find the post
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post not found");
  }
  //Push the user into post likes

  await Post.findByIdAndUpdate(
    id,
    {
      $addToSet: { likes: userId },
    },
    { new: true }
  );
  // Remove the user from the dislikes array if present
  post.dislikes = post.dislikes.filter(
    (dislike) => dislike.toString() !== userId.toString()
  );
  // resave the post
  await post.save();
  res.status(200).json({ message: "Post liked successfully.", post });
});

//@desc   dislike a Post
//@route  PUT /api/v1/posts/dislikes/:id
//@access Private

exports.disLikePost = asyncHandler(async (req, res) => {
  //Get the id of the post
  const { id } = req.params;
  //get the login user
  const userId = req.userAuth._id;
  //Find the post
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post not found");
  }
  //Push the user into post dislikes

  await Post.findByIdAndUpdate(
    id,
    {
      $addToSet: { dislikes: userId },
    },
    { new: true }
  );
  // Remove the user from the likes array if present
  post.likes = post.likes.filter(
    (like) => like.toString() !== userId.toString()
  );
  //resave the post
  await post.save();
  res.status(200).json({ message: "Post disliked successfully.", post });
});

//@desc   clapong a Post
//@route  PUT /api/v1/posts/claps/:id
//@access Private

exports.claps = asyncHandler(async (req, res) => {
  // Get the id of the post
  const { id } = req.params;
  // Find the post
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post not found");
  }
  // Implement the claps
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      $inc: { claps: 1 },
    },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Post clapped successfully.", updatedPost });
});

//@desc   Shedule a post
//@route  PUT /api/v1/posts/schedule/:postId
//@access Private

exports.schedule = asyncHandler(async (req, res) => {
  //get the payload
  const { scheduledPublish } = req.body;
  const { postId } = req.params;
  //check if postid and scheduledpublished found
  if (!postId || !scheduledPublish) {
    throw new Error("PostID and schedule date are required");
  }
  //Find the post
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  //check if tjhe user is the author of the post
  if (post.author.toString() !== req.userAuth._id.toString()) {
    throw new Error("You can schedule your own post ");
  }
  // Check if the scheduledPublish date is in the past
  const scheduleDate = new Date(scheduledPublish);
  const currentDate = new Date();
  if (scheduleDate < currentDate) {
    throw new Error("The scheduled publish date cannot be in the past.");
  }
  //update the post
  post.shedduledPublished = scheduledPublish;
  await post.save();
  res.json({
    status: "success",
    message: "Post scheduled successfully",
    post,
  });
});

//@desc   post  view count
//@route  PUT /api/v1/posts/:id/post-views-count
//@access Private

exports.postViewCount = asyncHandler(async (req, res) => {
  //Get the id of the post
  const { id } = req.params;
  //get the login user
  const userId = req.userAuth._id;
  //Find the post
  const post = await Post.findById(id);
  if (!post) {
    throw new Error("Post not found");
  }
  //Push thr user into post likes

  await Post.findByIdAndUpdate(
    id,
    {
      $addToSet: { postViews: userId },
    },
    { new: true }
  ).populate("author");
  await post.save();
  res.status(200).json({ message: "Post liked successfully.", post });
});
