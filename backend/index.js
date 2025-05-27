const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const initializeSocket = require('./config/socket');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Initialize Socket handlers
initializeSocket(io);

// Basic health check
app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
