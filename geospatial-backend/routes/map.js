const express = require('express');
const File = require('../models/File');
const authMiddleware = require('../utils/auth');

const router = express.Router();

// Fetch files for a user
router.get('/files', authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
