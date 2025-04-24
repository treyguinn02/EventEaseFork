/**
 * EventEase User Routes - Supabase Version
 * 
 * This file defines the user-related API routes for the EventEase application
 * using Supabase as the database.
 */

const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware for authentication
const authMiddleware = require('../middleware/auth');

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .limit(1);
      
    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create the user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) {
      return res.status(500).json({ message: authError.message });
    }
    
    // Create user record in the users table
    const { data: newUser, error: dbError } = await supabase
      .from('users')
      .insert([{
        id: authUser.user.id,
        username,
        email,
        password_hash: passwordHash,
        full_name: fullName || '',
      }])
      .select()
      .single();
      
    if (dbError) {
      return res.status(500).json({ message: dbError.message });
    }
    
    // Create and return JWT token
    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.full_name,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (authError) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Get user details from database
    const { data: user, error: dbError } = await supabase
      .from('users')
      .select('id, username, email, full_name, role, avatar_url')
      .eq('id', authData.user.id)
      .single();
      
    if (dbError) {
      return res.status(500).json({ message: dbError.message });
    }
    
    // Update last_active timestamp
    await supabase
      .from('users')
      .update({ last_active: new Date() })
      .eq('id', user.id);
    
    // Create and return JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        avatar: user.avatar_url
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      phone: user.phone,
      title: user.title,
      company: user.company,
      role: user.role,
      avatar: user.avatar_url,
      settings: {
        emailNotifications: user.email_notifications,
        taskReminders: user.task_reminders,
        darkMode: user.dark_mode,
        calendarSync: user.calendar_sync,
        language: user.language
      },
      createdAt: user.created_at,
      lastActive: user.last_active
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      username,
      fullName,
      phone,
      title,
      company,
      settings
    } = req.body;
    
    // Check if username is taken (if changing username)
    if (username) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .neq('id', userId);
        
      if (existingUser && existingUser.length > 0) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }
    
    // Prepare update data
    const updateData = {};
    if (username) updateData.username = username;
    if (fullName) updateData.full_name = fullName;
    if (phone) updateData.phone = phone;
    if (title) updateData.title = title;
    if (company) updateData.company = company;
    
    // Handle settings
    if (settings) {
      if (settings.emailNotifications !== undefined) updateData.email_notifications = settings.emailNotifications;
      if (settings.taskReminders !== undefined) updateData.task_reminders = settings.taskReminders;
      if (settings.darkMode !== undefined) updateData.dark_mode = settings.darkMode;
      if (settings.calendarSync !== undefined) updateData.calendar_sync = settings.calendarSync;
      if (settings.language) updateData.language = settings.language;
    }
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select();
      
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    res.json({
      id: data[0].id,
      username: data[0].username,
      email: data[0].email,
      fullName: data[0].full_name,
      phone: data[0].phone,
      title: data[0].title,
      company: data[0].company,
      role: data[0].role,
      avatar: data[0].avatar_url,
      settings: {
        emailNotifications: data[0].email_notifications,
        taskReminders: data[0].task_reminders,
        darkMode: data[0].dark_mode,
        calendarSync: data[0].calendar_sync,
        language: data[0].language
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/users/avatar
 * @desc    Update user avatar
 * @access  Private
 */
router.post('/avatar', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const avatarFile = req.files.avatar;
    
    // Upload to Supabase Storage
    const fileName = `avatar_${userId}_${Date.now()}.${avatarFile.name.split('.').pop()}`;
    
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(fileName, avatarFile.data, {
        contentType: avatarFile.mimetype,
        upsert: true
      });
      
    if (uploadError) {
      return res.status(500).json({ message: uploadError.message });
    }
    
    // Get public URL for the file
    const { data: publicUrl } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(fileName);
    
    // Update user record with new avatar URL
    const { data, error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl.publicUrl })
      .eq('id', userId)
      .select();
      
    if (updateError) {
      return res.status(500).json({ message: updateError.message });
    }
    
    res.json({ avatar: publicUrl.publicUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/users/password
 * @desc    Change user password
 * @access  Private
 */
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Get current user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();
      
    if (userError) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password in Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (authError) {
      return res.status(500).json({ message: authError.message });
    }
    
    // Hash and update password in users table
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: passwordHash })
      .eq('id', userId);
      
    if (updateError) {
      return res.status(500).json({ message: updateError.message });
    }
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
