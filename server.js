const http = require('http');
const express = require('express');
const usersRouter = require("./routes/users/usersRouter");
require("./config/database")();

// Server
const app = express();

app.use(express.json()); //Pass incoming data
// Routes
app.use("/api/v1/users", usersRouter);
// error middleware
app.use((err, req, res, next) => {
    //status
    const status = err?.status ? err?.status: "failed";
    //message
    const message = err?.message;
    //stack
    const stack = err?.stack;
  res.status(500).json({
    status,
    message,
    stack,
  });
});

const server = http.createServer(app);
// Start server

const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`Server running on port ${PORT}`));
