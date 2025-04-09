const express = require('express');
const router = express.Router();
const { Milestones } = require('../database/db');

// Get all milestones
router.get('/', async (req, res) => {
  try {
    // Get milestones with optional project filter
    const milestones = req.query.projectId 
      ? await Milestones.findByProject(req.query.projectId)
      : [];
    
    res.status(200).json(milestones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get milestones for a specific project
router.get('/project/:projectId', async (req, res) => {
  try {
    const milestones = await Milestones.findByProject(req.params.projectId);
    res.status(200).json(milestones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming milestones for a project
router.get('/project/:projectId/upcoming', async (req, res) => {
  try {
    const milestones = await Milestones.findUpcoming(req.params.projectId);
    res.status(200).json(milestones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get milestone by ID
router.get('/:id', async (req, res) => {
  try {
    // Since Milestones utility doesn't have a findById method, we'll implement it at the route level
    const { Milestone } = require('../database/schema');
    const milestone = await Milestone.findById(req.params.id);
    
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    res.status(200).json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new milestone
router.post('/', async (req, res) => {
  try {
    const newMilestone = await Milestones.create(req.body);
    res.status(201).json(newMilestone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a milestone
router.put('/:id', async (req, res) => {
  try {
    const updatedMilestone = await Milestones.update(req.params.id, req.body);
    if (!updatedMilestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    res.status(200).json(updatedMilestone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update milestone status
router.patch('/:id/status', async (req, res) => {
  try {
    if (!req.body.status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const updatedMilestone = await Milestones.changeStatus(req.params.id, req.body.status);
    
    if (!updatedMilestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    
    res.status(200).json(updatedMilestone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a milestone
router.delete('/:id', async (req, res) => {
  try {
    const deletedMilestone = await Milestones.delete(req.params.id);
    if (!deletedMilestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    res.status(200).json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;