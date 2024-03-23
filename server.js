const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const express = require('express');
const usersRouter = require("./routes/users/usersRouter");
const postsRouter = require("./routes/post/postRouter");
const { notFound, globalErrorHandler } = require('./middlewares/globalErrorHandler');
const categoryRouter = require("./routes/category/categoryRouter");
const commentRouter = require("./routes/comment/commentRouter");

// Database
require("./config/database")();

// Server
const app = express();

app.use(express.json()); //Pass incoming data
// Routes
app.use("/api/v1/users", usersRouter);
// category
app.use("/api/v1/categories", categoryRouter);
// post
app.use("/api/v1/posts", postsRouter);
// comment
app.use("/api/v1/comments", commentRouter);
// not found middleware
app.use(notFound);
// error middleware
app.use(globalErrorHandler);

const server = http.createServer(app);
// Start server

const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`Server running on port ${PORT}`));
