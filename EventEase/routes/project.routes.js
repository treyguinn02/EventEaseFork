const express = require('express');
const router = express.Router();
const { Projects } = require('../database/db');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Projects.list();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Projects.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get projects for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const projects = await Projects.findByUser(req.params.userId);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  try {
    const savedProject = await Projects.create(req.body);
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    const updatedProject = await Projects.update(req.params.id, req.body);
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const deletedProject = await Projects.delete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a member to a project
router.post('/:id/members', async (req, res) => {
  try {
    const updatedProject = await Projects.addMember(req.params.id, req.body);
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove a member from a project
router.delete('/:id/members/:userId', async (req, res) => {
  try {
    const updatedProject = await Projects.removeMember(req.params.id, req.params.userId);
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;