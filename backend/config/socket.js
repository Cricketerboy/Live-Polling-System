const { handleNewPoll, handleSubmitAnswer, handleDisconnect } = require('../controllers/poll.controller');

let ioInstance;
const participants = new Map();

const initializeSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

     socket.on('join', ({ name }) => {
      participants.set(socket.id, name);
      io.emit('participants', Array.from(participants.values())); // broadcast updated list
    });

    socket.on('new-poll', (poll) => handleNewPoll(io, poll));
    socket.on('submit-answer', (data) => handleSubmitAnswer(io, data));
    socket.on('disconnect', () => handleDisconnect(socket));
    socket.on('send-message', ({ sender, message }) => {
  io.emit('receive-message', { sender, message, timestamp: Date.now() });
});

socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      participants.delete(socket.id); // Remove from list
      io.emit('participants', Array.from(participants.values())); // broadcast updated list
      handleDisconnect(socket);
    });

  });
};

module.exports = initializeSocket;
