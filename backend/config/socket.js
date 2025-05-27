const { handleNewPoll, handleSubmitAnswer, handleDisconnect } = require('../controllers/poll.controller');

let ioInstance;

const initializeSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('new-poll', (poll) => handleNewPoll(io, poll));
    socket.on('submit-answer', (data) => handleSubmitAnswer(io, data));
    socket.on('disconnect', () => handleDisconnect(socket));
  });
};

module.exports = initializeSocket;
