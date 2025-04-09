const express = require('express');
const router = express.Router();
const { Notes } = require('../database/db');

// Get all notes
router.get('/', async (req, res) => {
  try {
    // Get notes with optional filters
    let notes;
    if (req.query.projectId) {
      notes = await Notes.findByProject(req.query.projectId);
    } else if (req.query.creatorId) {
      notes = await Notes.findByCreator(req.query.creatorId);
    } else if (req.query.sharedWithId) {
      notes = await Notes.findSharedWithUser(req.query.sharedWithId);
    } else {
      // Since we don't have a list all method, we'll default to project filter
      const { Note } = require('../database/schema');
      notes = await Note.find().limit(50);
    }
    
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get notes for a specific project
router.get('/project/:projectId', async (req, res) => {
  try {
    const notes = await Notes.findByProject(req.params.projectId);
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get notes created by a specific user
router.get('/creator/:userId', async (req, res) => {
  try {
    const notes = await Notes.findByCreator(req.params.userId);
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get notes shared with a specific user
router.get('/shared/:userId', async (req, res) => {
  try {
    const notes = await Notes.findSharedWithUser(req.params.userId);
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get note by ID
router.get('/:id', async (req, res) => {
  try {
    // Since Notes utility doesn't have a findById method, we'll implement it at the route level
    const { Note } = require('../database/schema');
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  try {
    const newNote = await Notes.create(req.body);
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    const { editorId, ...noteData } = req.body;
    const updatedNote = await Notes.update(req.params.id, noteData, editorId);
    
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Share note with users
router.post('/:id/share', async (req, res) => {
  try {
    if (!req.body.userIds || !Array.isArray(req.body.userIds)) {
      return res.status(400).json({ message: 'Array of userIds is required' });
    }
    
    const updatedNote = await Notes.shareWithUsers(req.params.id, req.body.userIds);
    
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Unshare note with a user
router.delete('/:id/share/:userId', async (req, res) => {
  try {
    // Since the utility doesn't have an unshare method, we'll implement it here
    const { Note } = require('../database/schema');
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $pull: { sharedWith: req.params.userId } },
      { new: true }
    );
    
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const deletedNote = await Notes.delete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;