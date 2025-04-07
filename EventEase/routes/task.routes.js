const express = require('express');
const router = express.Router();
const { Tasks } = require('../database/db');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    // The Tasks utility doesn't have a list all method, but we can retrieve tasks based on filters
    const tasks = await Tasks.findByProject(req.query.projectId || null);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tasks for a specific project
router.get('/project/:projectId', async (req, res) => {
  try {
    const tasks = await Tasks.findByProject(req.params.projectId);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tasks assigned to a specific user
router.get('/assignee/:userId', async (req, res) => {
  try {
    const tasks = await Tasks.findByAssignee(req.params.userId);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get task by ID - we'll need to implement a utility method for this
router.get('/:id', async (req, res) => {
  try {
    // Since Tasks utility doesn't have a findById method, we'll implement it at the route level
    const { Task } = require('../database/schema');
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const savedTask = await Tasks.create(req.body);
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Tasks.update(req.params.id, req.body);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update task status
router.patch('/:id/status', async (req, res) => {
  try {
    if (!req.body.status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const updatedTask = await Tasks.changeStatus(req.params.id, req.body.status);
    
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Tasks.delete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;