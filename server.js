const http = require('http');
const express = require('express');

// Server
const app = express();

const server = http.createServer(app);
// Start server

const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`Server running on port ${PORT}`));