/**
 * EventEase Database Connection and Operations
 * 
 * This file provides functions for connecting to MongoDB
 * and performing database operations for the EventEase application.
 */

const mongoose = require('mongoose');
require('dotenv').config();
const {
  User,
  Project,
  Message,
  Task,
  File,
  Note,
  Milestone
} = require('./schema');

// MongoDB connection string (would typically be in .env file)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease';

/**
 * Connect to MongoDB database
 * @returns {Promise} Connection object
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Close the database connection
 * @returns {Promise}
 */
async function close() {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    return true;
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
}

// User collection operations
const Users = {
  /**
   * Find a user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} User object
   */
  findById: async (id) => {
    return User.findById(id);
  },

  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User object
   */
  findByEmail: async (email) => {
    return User.findOne({ email });
  },

  /**
   * Find a user by username
   * @param {string} username - Username
   * @returns {Promise<Object>} User object
   */
  findByUsername: async (username) => {
    return User.findOne({ username });
  },

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user object
   */
  create: async (userData) => {
    const user = new User(userData);
    return user.save();
  },

  /**
   * Update a user
   * @param {string} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated user object
   */
  update: async (id, updates) => {
    return User.findByIdAndUpdate(id, updates, { new: true });
  },

  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {Promise<Object>} Deletion result
   */
  delete: async (id) => {
    return User.findByIdAndDelete(id);
  },

  /**
   * List all users
   * @param {Object} filter - Optional filter criteria
   * @returns {Promise<Array>} Array of user objects
   */
  list: async (filter = {}) => {
    return User.find(filter);
  }
};

// Project collection operations
const Projects = {
  /**
   * Find a project by ID
   * @param {string} id - Project ID
   * @returns {Promise<Object>} Project object
   */
  findById: async (id) => {
    return Project.findById(id);
  },

  /**
   * Find all projects a user is a member of
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of project objects
   */
  findByUser: async (userId) => {
    return Project.find({ 'members.userId': userId });
  },

  /**
   * Find projects by creator
   * @param {string} userId - User ID of creator
   * @returns {Promise<Array>} Array of project objects
   */
  findByCreator: async (userId) => {
    return Project.find({ createdBy: userId });
  },

  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @returns {Promise<Object>} Created project object
   */
  create: async (projectData) => {
    const project = new Project(projectData);
    return project.save();
  },

  /**
   * Update a project
   * @param {string} id - Project ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated project object
   */
  update: async (id, updates) => {
    return Project.findByIdAndUpdate(id, updates, { new: true });
  },

  /**
   * Delete a project
   * @param {string} id - Project ID
   * @returns {Promise<Object>} Deletion result
   */
  delete: async (id) => {
    // In a real application, you might want to delete related entities as well
    return Project.findByIdAndDelete(id);
  },

  /**
   * Add a member to a project
   * @param {string} projectId - Project ID
   * @param {Object} memberData - Member data (userId, role)
   * @returns {Promise<Object>} Updated project object
   */
  addMember: async (projectId, memberData) => {
    return Project.findByIdAndUpdate(
      projectId,
      { $push: { members: memberData } },
      { new: true }
    );
  },

  /**
   * Remove a member from a project
   * @param {string} projectId - Project ID
   * @param {string} userId - User ID to remove
   * @returns {Promise<Object>} Updated project object
   */
  removeMember: async (projectId, userId) => {
    return Project.findByIdAndUpdate(
      projectId,
      { $pull: { members: { userId } } },
      { new: true }
    );
  },

  /**
   * List all projects
   * @param {Object} filter - Optional filter criteria
   * @returns {Promise<Array>} Array of project objects
   */
  list: async (filter = {}) => {
    return Project.find(filter);
  }
};

// Message collection operations
const Messages = {
  /**
   * Find messages for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} Array of message objects
   */
  findByProject: async (projectId) => {
    return Message.find({ projectId }).sort({ timestamp: 1 });
  },

  /**
   * Find messages by user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of message objects
   */
  findByUser: async (userId) => {
    return Message.find({ userId });
  },

  /**
   * Create a new message
   * @param {Object} messageData - Message data
   * @returns {Promise<Object>} Created message object
   */
  create: async (messageData) => {
    const message = new Message(messageData);
    return message.save();
  },

  /**
   * Update a message
   * @param {string} id - Message ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated message object
   */
  update: async (id, updates) => {
    return Message.findByIdAndUpdate(id, updates, { new: true });
  },

  /**
   * Delete a message
   * @param {string} id - Message ID
   * @returns {Promise<Object>} Deletion result
   */
  delete: async (id) => {
    return Message.findByIdAndDelete(id);
  },

  /**
   * Mark message as read by a user
   * @param {string} messageId - Message ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated message object
   */
  markAsRead: async (messageId, userId) => {
    return Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: userId } },
      { new: true }
    );
  }
};

// Task collection operations
const Tasks = {
  /**
   * Find tasks for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} Array of task objects
   */
  findByProject: async (projectId) => {
    return Task.find({ projectId });
  },

  /**
   * Find tasks assigned to a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of task objects
   */
  findByAssignee: async (userId) => {
    return Task.find({ assignedTo: userId });
  },

  /**
   * Find tasks created by a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of task objects
   */
  findByCreator: async (userId) => {
    return Task.find({ createdBy: userId });
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>} Created task object
   */
  create: async (taskData) => {
    const task = new Task(taskData);
    return task.save();
  },

  /**
   * Update a task
   * @param {string} id - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated task object
   */
  update: async (id, updates) => {
    return Task.findByIdAndUpdate(id, updates, { new: true });
  },

  /**
   * Delete a task
   * @param {string} id - Task ID
   * @returns {Promise<Object>} Deletion result
   */
  delete: async (id) => {
    return Task.findByIdAndDelete(id);
  },

  /**
   * Change task status
   * @param {string} id - Task ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated task object
   */
  changeStatus: async (id, status) => {
    return Task.findByIdAndUpdate(id, { status }, { new: true });
  }
};

// File collection operations
const Files = {
  /**
   * Find files for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} Array of file objects
   */
  findByProject: async (projectId) => {
    return File.find({ projectId });
  },

  /**
   * Find files uploaded by a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of file objects
   */
  findByUploader: async (userId) => {
    return File.find({ uploadedBy: userId });
  },

  /**
   * Create a new file
   * @param {Object} fileData - File data
   * @returns {Promise<Object>} Created file object
   */
  create: async (fileData) => {
    const file = new File(fileData);
    return file.save();
  },

  /**
   * Update a file
   * @param {string} id - File ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated file object
   */
  update: async (id, updates) => {
    return File.findByIdAndUpdate(id, updates, { new: true });
  },

  /**
   * Delete a file
   * @param {string} id - File ID
   * @returns {Promise<Object>} Deletion result
   */
  delete: async (id) => {
    return File.findByIdAndDelete(id);
  },

  /**
   * Add a new version of a file
   * @param {string} id - File ID
   * @param {Object} versionData - Version data (fileUrl, uploadedBy)
   * @returns {Promise<Object>} Updated file object
   */
  addVersion: async (id, versionData) => {
    const file = await File.findById(id);
    if (!file) return null;

    // Add current version to previous versions
    const previousVersion = {
      fileUrl: file.fileUrl,
      uploadedAt: file.uploadedAt,
      uploadedBy: file.uploadedBy
    };

    return File.findByIdAndUpdate(
      id,
      {
        fileUrl: versionData.fileUrl,
        uploadedAt: new Date(),
        uploadedBy: versionData.uploadedBy,
        version: file.version + 1,
        $push: { previousVersions: previousVersion }
      },
      { new: true }
    );
  }
};

// Note collection operations
const Notes = {
  /**
   * Find notes for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} Array of note objects
   */
  findByProject: async (projectId) => {
    return Note.find({ projectId });
  },

  /**
   * Find notes created by a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of note objects
   */
  findByCreator: async (userId) => {
    return Note.find({ createdBy: userId });
  },

  /**
   * Find notes shared with a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of note objects
   */
  findSharedWithUser: async (userId) => {
    return Note.find({ sharedWith: userId });
  },

  /**
   * Create a new note
   * @param {Object} noteData - Note data
   * @returns {Promise<Object>} Created note object
   */
  create: async (noteData) => {
    const note = new Note(noteData);
    return note.save();
  },

  /**
   * Update a note
   * @param {string} id - Note ID
   * @param {Object} updates - Fields to update
   * @param {string} editorId - ID of user making the edit
   * @returns {Promise<Object>} Updated note object
   */
  update: async (id, updates, editorId) => {
    const updatedData = {
      ...updates,
      lastEditedBy: editorId,
      lastEditedAt: new Date()
    };
    return Note.findByIdAndUpdate(id, updatedData, { new: true });
  },

  /**
   * Delete a note
   * @param {string} id - Note ID
   * @returns {Promise<Object>} Deletion result
   */
  delete: async (id) => {
    return Note.findByIdAndDelete(id);
  },

  /**
   * Share a note with users
   * @param {string} noteId - Note ID
   * @param {Array} userIds - Array of user IDs
   * @returns {Promise<Object>} Updated note object
   */
  shareWithUsers: async (noteId, userIds) => {
    return Note.findByIdAndUpdate(
      noteId,
      { $addToSet: { sharedWith: { $each: userIds } } },
      { new: true }
    );
  }
};

// Milestone collection operations
const Milestones = {
  /**
   * Find milestones for a project
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} Array of milestone objects
   */
  findByProject: async (projectId) => {
    return Milestone.find({ projectId }).sort({ date: 1 });
  },

  /**
   * Find upcoming milestones
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>} Array of upcoming milestone objects
   */
  findUpcoming: async (projectId) => {
    const now = new Date();
    return Milestone.find({
      projectId,
      date: { $gt: now }
    }).sort({ date: 1 });
  },

  /**
   * Create a new milestone
   * @param {Object} milestoneData - Milestone data
   * @returns {Promise<Object>} Created milestone object
   */
  create: async (milestoneData) => {
    const milestone = new Milestone(milestoneData);
    return milestone.save();
  },

  /**
   * Update a milestone
   * @param {string} id - Milestone ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated milestone object
   */
  update: async (id, updates) => {
    const updatedData = {
      ...updates,
      lastUpdatedAt: new Date()
    };
    return Milestone.findByIdAndUpdate(id, updatedData, { new: true });
  },

  /**
   * Delete a milestone
   * @param {string} id - Milestone ID
   * @returns {Promise<Object>} Deletion result
   */
  delete: async (id) => {
    return Milestone.findByIdAndDelete(id);
  },

  /**
   * Change milestone status
   * @param {string} id - Milestone ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated milestone object
   */
  changeStatus: async (id, status) => {
    return Milestone.findByIdAndUpdate(
      id,
      { 
        status,
        lastUpdatedAt: new Date()
      },
      { new: true }
    );
  }
};

// Export database operations
module.exports = {
  connectDB,
  close,
  Users,
  Projects,
  Messages,
  Tasks,
  Files,
  Notes,
  Milestones
};