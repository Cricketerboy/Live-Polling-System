const { handleNewPoll, handleSubmitAnswer, handleDisconnect } = require('../controllers/poll.controller');

let ioInstance;
const messages = []; // <-- Store chat messages here


const initializeSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
     // Send full chat history to newly connected client
     socket.on('get-chat-history', () => {
      socket.emit('chat-history', messages);
    });
    socket.on('new-poll', (poll) => handleNewPoll(io, poll));
    socket.on('submit-answer', (data) => handleSubmitAnswer(io, data));
    socket.on('disconnect', () => handleDisconnect(socket));
    socket.on('send-message', ({ sender, message }) => {
      const newMessage = { sender, message, timestamp: Date.now() };
      messages.push(newMessage);
      io.emit('receive-message', newMessage);
    });

  });
};

module.exports = initializeSocket;
