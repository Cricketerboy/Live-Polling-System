const pollManager = require('../utils/pollManager');

const handleNewPoll = (io, poll) => {
  pollManager.startNewPoll(poll);
  io.emit('poll-started', poll);

  setTimeout(() => {
    io.emit('poll-ended');
    pollManager.endPoll();
  }, poll.duration * 1000);
};

const handleSubmitAnswer = (io, { studentId, option }) => {
  if (!pollManager.isPollActive() || pollManager.hasResponded(studentId)) return;

  pollManager.addResponse(studentId, option);

  const tally = pollManager.getResults();
  io.emit('poll-results', tally);
};

const handleDisconnect = (socket) => {
  console.log('User disconnected:', socket.id);
};

module.exports = {
  handleNewPoll,
  handleSubmitAnswer,
  handleDisconnect,
};
