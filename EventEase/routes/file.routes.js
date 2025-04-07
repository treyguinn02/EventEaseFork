const express = require('express');
const router = express.Router();
const { Files } = require('../database/db');

// Get all files
router.get('/', async (req, res) => {
  try {
    // Get files with optional project filter
    const files = req.query.projectId 
      ? await Files.findByProject(req.query.projectId)
      : await Files.findByUploader(req.query.uploaderId || null);
    
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get files for a specific project
router.get('/project/:projectId', async (req, res) => {
  try {
    const files = await Files.findByProject(req.params.projectId);
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get files uploaded by a specific user
router.get('/uploader/:userId', async (req, res) => {
  try {
    const files = await Files.findByUploader(req.params.userId);
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get file by ID
router.get('/:id', async (req, res) => {
  try {
    // Since Files utility doesn't have a findById method, we'll implement it at the route level
    const { File } = require('../database/schema');
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload a new file
router.post('/', async (req, res) => {
  try {
    const newFile = await Files.create(req.body);
    res.status(201).json(newFile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update file metadata
router.put('/:id', async (req, res) => {
  try {
    const updatedFile = await Files.update(req.params.id, req.body);
    if (!updatedFile) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json(updatedFile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a new version of a file
router.post('/:id/versions', async (req, res) => {
  try {
    const updatedFile = await Files.addVersion(req.params.id, req.body);
    if (!updatedFile) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json(updatedFile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a file
router.delete('/:id', async (req, res) => {
  try {
    const deletedFile = await Files.delete(req.params.id);
    if (!deletedFile) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;