const express = require("express");
const { register, login, getProfile, blockUser, unblockUser } = require("../../controllers/users/usersCtrl");
const isLoggin = require("../../middlewares/isLoggin");
const usersRouter = express.Router();

//!Register
usersRouter.post("/register", register);

//!Login
usersRouter.post("/login", login);

// profile
usersRouter.get("/profile", isLoggin, getProfile);

// block user
usersRouter.put("/block/:userIdToBlock", isLoggin, blockUser);

// unblock user
usersRouter.put("/unblock/:userIdToUnBlock", isLoggin, unblockUser);

// * Export
module.exports = usersRouter;   