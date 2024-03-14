const http = require('http');
const express = require('express');
const usersRouter = require("./routes/users/usersRouter");
require("./config/database")();

// Server
const app = express();

app.use(express.json()); //Pass incoming data
// Routes
app.use("/", usersRouter);

const server = http.createServer(app);
// Start server

const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`Server running on port ${PORT}`));