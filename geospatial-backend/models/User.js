const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the User
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if the password is new or modified
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Check if the model is already defined in Mongoose's model cache
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
