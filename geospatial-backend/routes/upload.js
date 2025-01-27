const express = require('express');
const multer = require('multer');
const File = require('../models/File');
const authMiddleware = require('../utils/auth');

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', (req, res) => {
  res.send('Upload route is working!');
});


router.post('/geojson', authMiddleware, upload.single('file'), async (req, res) => {
  const { originalname, mimetype } = req.file;

  // Log the uploaded file's mimetype
  console.log('Uploaded file mimetype:', mimetype);

  // Update the allowed MIME types to include 'application/geo+json'
  if (!['application/json', 'application/vnd.google-earth.kml+xml', 'application/geo+json','application/octet-stream'].includes(mimetype)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }

  try {
    const file = new File({
      user: req.user.id,
      name: originalname,
      type: mimetype,
      data: req.file.buffer.toString(), // Store as string
    });

    await file.save();
    console.log('Saved file to MongoDB:', file);
    res.status(201).json({ message: 'File uploaded successfully', file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
