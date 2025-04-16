const express = require('express');
const router = express.Router();
const { Users } = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const auth = require('../middleware/auth');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await Users.findByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    user = await Users.findByUsername(username);
    if (user) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = await Users.create({
      username,
      email,
      password: hashedPassword,
      fullName: req.body.fullName || '',
      phone: req.body.phone || '',
      title: req.body.title || '',
      company: req.body.company || '',
      avatar: req.body.avatar || '',
      settings: {
        emailNotifications: true,
        taskReminders: true,
        darkMode: false,
        calendarSync: false,
        language: 'en'
      }
    });

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, email: newUser.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await Users.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update lastActive
    await Users.update(user._id, { lastActive: new Date() });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        phone: user.phone,
        title: user.title,
        company: user.company,
        settings: user.settings
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a user
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Make sure the user is updating their own profile or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to update this user' });
    }

    const updateData = { ...req.body };
    
    // Don't allow direct password update through this endpoint
    if (updateData.password) {
      delete updateData.password;
    }

    const updatedUser = await Users.update(req.params.id, updateData);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't return the password
    const userResponse = { ...updatedUser.toObject() };
    delete userResponse.password;
    
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user settings
router.put('/:id/settings', authenticateToken, async (req, res) => {
  try {
    // Make sure the user is updating their own settings or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to update settings for this user' });
    }

    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.settings = {
      ...user.settings,
      ...req.body
    };

    const updatedUser = await Users.update(req.params.id, { settings: user.settings });
    
    // Don't return the password
    const userResponse = { ...updatedUser.toObject() };
    delete userResponse.password;
    
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Change password
router.put('/:id/password', authenticateToken, async (req, res) => {
  try {
    // Make sure the user is changing their own password or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to change password for this user' });
    }

    const { currentPassword, newPassword } = req.body;
    
    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await Users.update(req.params.id, { password: hashedPassword });
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Upload avatar
router.post('/:id/avatar', authenticateToken, async (req, res) => {
  try {
    // Make sure the user is uploading their own avatar or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to upload avatar for this user' });
    }

    // Handle file upload logic here (typically with a library like multer)
    // For this example, we'll assume the avatar URL is sent in the request body
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({ message: 'No avatar URL provided' });
    }

    const updatedUser = await Users.update(req.params.id, { avatar: avatarUrl });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      message: 'Avatar uploaded successfully',
      avatarUrl: updatedUser.avatar
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Make sure the user is deleting their own account or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this user' });
    }

    const deletedUser = await Users.delete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't return the password
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const users = await Users.list();
    
    // Don't return passwords
    const usersResponse = users.map(user => {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    });
    
    res.status(200).json(usersResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // Make sure user is accessing their own data or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't return the password
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;