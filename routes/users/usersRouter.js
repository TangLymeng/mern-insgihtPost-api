const express = require("express");
const { register, login } = require("../../controllers/users/usersCtrl");

const usersRouter = express.Router();

//!Register
usersRouter.post("/api/v1/users/register", register);
usersRouter.post("/api/v1/users/login", login);

// * Export
module.exports = usersRouter;