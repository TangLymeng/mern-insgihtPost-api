const asyncHandler = require("express-async-handler");
const Category = require("../../model/Category/Category");

// Create a category
// POST /api/v1/categories
// Private

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, author } = req.body;
  // if exist
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error("Category already exists");
  }
  const category = await Category.create({
    name: name,
    author: req.userAuth?._id,
  });
  res.status(201).json({
    status: "success",
    message: "Category successfully created",
    category,
  });
});

//@desc  Get all Categoris
//@route GET /api/v1/categories
//@access PUBLIC

exports.getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.status(201).json({
      status: "success",
      message: "Categoryies successfully fetched",
      categories,
    });
});

//@desc  Get single Category
//@route GET /api/v1/categories/:id
//@access PUBLIC

exports.getCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new Error("Category not found");
    }
    res.status(201).json({
      status: "success",
      message: "Category successfully fetched",
      category,
    });
});

// Delete a category
// DELETE /api/v1/categories/:id
// Private

exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new Error("Category not found");
  }
  await category.deleteOne();
  res.status(201).json({
    status: "success",
    message: "Category successfully deleted",
  });
});

// Update a category
// PUT /api/v1/categories/:id
// Private

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true, // Return the updated document
      runValidators: true, // Run validators for update operation
    }
  );

  if (!category) {
    // If category is not found, send a 404 response
    return res.status(404).json({
      status: "error",
      message: "Category not found",
    });
  }

  // If category is successfully updated, send a success response
  res.status(200).json({
    status: "success",
    message: "Category successfully updated",
    category,
  });
});
