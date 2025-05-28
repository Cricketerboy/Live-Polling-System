let currentPoll = null;
let responses = {};
let pollHistory = []; // ✅ new

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

// ✅ new: Save results
const saveToHistory = (poll, results) => {
  pollHistory.push({
    question: poll.question,
    timestamp: poll.timestamp,
    results
  });
};

// ✅ new: Return all history
const getHistory = () => pollHistory;

module.exports = {
  startNewPoll,
  endPoll,
  isPollActive,
  hasResponded,
  addResponse,
  getResults,
  saveToHistory,
  getHistory
};
