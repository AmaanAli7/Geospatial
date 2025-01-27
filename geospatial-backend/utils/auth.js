// utils/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Make sure you have a User model

const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the Authorization header (Bearer token)
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify the token
    const decoded = jwt.verify(token,  process.env.JWT_SECRET);  // Replace with your secret key
    console.log(decoded);
    // Find the user based on the decoded token
    const user = await User.findById(decoded.id).catch(error => {
        return res.status(500).json({ error: 'Error fetching user from the database' });
      });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
