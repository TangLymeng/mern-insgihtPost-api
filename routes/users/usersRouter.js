const express = require("express");
const multer = require("multer");
const {
  register,
  login,
  getProfile,
  blockUser,
  unblockUser,
  profileViewers,
  getPublicProfile,
  followingUser,
  unFollowingUser,
  resetPassword,
  forgotPassword,
  accountVerificationEmail,
  verifyAccount,
  uploadeCoverImage,
  uploadeProfilePicture,
} = require("../../controllers/users/usersCtrl");
const isLoggin = require("../../middlewares/isLoggin");
const storage = require("../../utils/fileUpload");
const usersRouter = express.Router();

// file upload middleware
const upload = multer({ storage });

//!Register
usersRouter.post("/register", register);

//!Login
usersRouter.post("/login", login);

// upload profile image
usersRouter.put(
  "/upload-profile-image",
  isLoggin,
  upload.single("file"),
  uploadeProfilePicture
);
// upload profile image
usersRouter.put(
  "/upload-cover-image",
  isLoggin,
  upload.single("file"),
  uploadeCoverImage
);

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

// send account verification email
usersRouter.put(
  "/account-verification-email",
  isLoggin,
  accountVerificationEmail
);

// verify account
usersRouter.put("/account-verification/:verifyToken", isLoggin, verifyAccount);

// forgot password
usersRouter.post("/forgot-password", forgotPassword);

// reset password
usersRouter.post("/reset-password/:resetToken", resetPassword);

// profile
usersRouter.get("/profile/", isLoggin, getProfile);

// public profile
usersRouter.get("/public-profile/:userId", getPublicProfile);

// * Export
module.exports = usersRouter;
