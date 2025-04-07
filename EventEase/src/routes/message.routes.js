const express = require('express');
const router = express.Router();
const { Messages } = require('../database/db');

// Get all messages
router.get('/', async (req, res) => {
  try {
    // Since we don't have a list all method in the utility, we'll use a filter
    const messages = req.query.projectId 
      ? await Messages.findByProject(req.query.projectId)
      : await Messages.findByUser(req.query.userId || null);
    
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages for a specific project
router.get('/project/:projectId', async (req, res) => {
  try {
    const messages = await Messages.findByProject(req.params.projectId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages from a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const messages = await Messages.findByUser(req.params.userId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get message by ID
router.get('/:id', async (req, res) => {
  try {
    // Since Messages utility doesn't have a findById method, we'll implement it at the route level
    const { Message } = require('../database/schema');
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new message
router.post('/', async (req, res) => {
  try {
    const newMessage = await Messages.create(req.body);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a message
router.put('/:id', async (req, res) => {
  try {
    const updatedMessage = await Messages.update(req.params.id, req.body);
    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark message as read by a user
router.patch('/:id/read/:userId', async (req, res) => {
  try {
    const updatedMessage = await Messages.markAsRead(req.params.id, req.params.userId);
    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a message
router.delete('/:id', async (req, res) => {
  try {
    const deletedMessage = await Messages.delete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;