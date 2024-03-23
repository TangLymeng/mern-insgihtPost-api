const express = require("express");
const {
    createCategory,
    getCategories,
    getCategory,
    deleteCategory,
    updateCategory,
} = require("../../controllers/categories/category");
const isLoggin = require("../../middlewares/isLoggin");

const categoryRouter = express.Router();

//create
categoryRouter.post("/", isLoggin, createCategory);

// all
categoryRouter.get("/", getCategories);

// get single category
categoryRouter.get("/:id", getCategory);

// delete
categoryRouter.delete("/:id", isLoggin, deleteCategory);

// update
categoryRouter.put("/:id", isLoggin, updateCategory);

module.exports = categoryRouter;