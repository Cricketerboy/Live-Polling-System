const express = require('express');
const router = express.Router();
const pollManager = require('../utils/pollManager');

router.get('/poll-history', (req, res) => {
  res.json(pollManager.getHistory());
});

module.exports = router;
