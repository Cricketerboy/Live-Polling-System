let currentPoll = null;
let responses = {};

const startNewPoll = (poll) => {
  currentPoll = poll;
  responses = {};
};

const endPoll = () => {
  currentPoll = null;
  responses = {};
};

const isPollActive = () => !!currentPoll;

const hasResponded = (studentId) => !!responses[studentId];

const addResponse = (studentId, option) => {
  responses[studentId] = option;
};

const getResults = () => {
  const tally = {};
  Object.values(responses).forEach((opt) => {
    tally[opt] = (tally[opt] || 0) + 1;
  });
  return tally;
};

module.exports = {
  startNewPoll,
  endPoll,
  isPollActive,
  hasResponded,
  addResponse,
  getResults,
};
