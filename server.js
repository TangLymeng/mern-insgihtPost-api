const http = require('http');
const express = require('express');
const usersRouter = require("./routes/users/usersRouter");
const { notFound, globalErrorHandler } = require('./middlewares/globalErrorHandler');
require("./config/database")();

// Server
const app = express();

app.use(express.json()); //Pass incoming data
// Routes
app.use("/api/v1/users", usersRouter);
// not found middleware
app.use(notFound);
// error middleware
app.use(globalErrorHandler);

const server = http.createServer(app);
// Start server

const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`Server running on port ${PORT}`));
