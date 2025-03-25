/**
 * EventEase NoSQL Database Schema (MongoDB)
 * 
 * This file defines the schema for the MongoDB collections used in the EventEase application.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Users Collection Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: String,
  role: {
    type: String,
    enum: ['Admin', 'Member', 'Guest'],
    default: 'Member'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Projects Collection Schema
const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  members: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['Owner', 'Admin', 'Member'],
      default: 'Member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['Active', 'Completed', 'On Hold', 'Cancelled'],
    default: 'Active'
  }
});

// Messages Collection Schema
const messageSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String
  }],
  readBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Tasks Collection Schema
const taskSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  description: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: [String]
});

// Files Collection Schema
const fileSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  fileUrl: {
    type: String,
    required: true
  },
  fileType: String,
  fileSize: Number,
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    fileUrl: String,
    uploadedAt: Date,
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
});

// Notes Collection Schema
const noteSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastEditedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  lastEditedAt: Date,
  sharedWith: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [String]
});

// Timeline (Milestones) Collection Schema
const milestoneSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['planned', 'completed', 'delayed'],
    default: 'planned'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  },
  notifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    reminderDays: {
      type: Number,
      default: 7
    }
  }
});

// Create models
const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);
const Message = mongoose.model('Message', messageSchema);
const Task = mongoose.model('Task', taskSchema);
const File = mongoose.model('File', fileSchema);
const Note = mongoose.model('Note', noteSchema);
const Milestone = mongoose.model('Milestone', milestoneSchema);

// Export all models
module.exports = {
  User,
  Project,
  Message,
  Task,
  File,
  Note,
  Milestone
};