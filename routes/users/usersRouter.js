const express = require("express");
const { register, login, getProfile, blockUser, unblockUser, profileViewers, followingUser, unFollowingUser, forgotPassword, resetPassword } = require("../../controllers/users/usersCtrl");
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

// profile viewers
usersRouter.get("/profile-viewer/:userProfileId", isLoggin, profileViewers);

// following user
usersRouter.put("/following/:userToFollowId", isLoggin, followingUser);

// unfollowing user
usersRouter.put("/unfollowing/:userToUnFollowId", isLoggin, unFollowingUser);

// forgot password
usersRouter.post("/forgot-password", forgotPassword);

// reset password
usersRouter.post("/reset-password/:resetToken", resetPassword);
// * Export
module.exports = usersRouter;   