const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./src/database/db');
const { Messages } = require('./src/database/db');
require('dotenv').config();

// Import routes
const userRoutes = require('./src/routes/user.routes');
const projectRoutes = require('./src/routes/project.routes');
const taskRoutes = require('./src/routes/task.routes');
const messageRoutes = require('./src/routes/message.routes');
const fileRoutes = require('./src/routes/file.routes');
const noteRoutes = require('./src/routes/note.routes');
const milestoneRoutes = require('./src/routes/milestone.routes');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // In production, you should restrict this to your app's domain
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('dev'));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/milestones', milestoneRoutes);

// Root route for API health check
app.get('/api', (req, res) => {
  res.json({ message: 'EventEase API is running' });
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('dist'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, add a catch-all route for client-side routing
  app.get('*', (req, res) => {
    res.json({ message: 'This route is not handled by the API. In production, it would serve the React app.' });
  });
}

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Handle joining a project room
  socket.on('join_project', (projectId) => {
    console.log(`Client joining project: ${projectId}`);
    
    // Leave all previous rooms
    socket.rooms.forEach(room => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
    
    // Join the new project room
    socket.join(projectId);
  });
  
  // Handle chat messages
  socket.on('chat_message', async (messageData) => {
    try {
      console.log('Message received:', messageData);
      
      // Store message in database
      const savedMessage = await Messages.create(messageData);
      
      // Broadcast message to all clients in the same project room
      io.to(messageData.projectId).emit('new_message', {
        id: savedMessage._id,
        user: messageData.username || 'Unknown User',
        text: messageData.text,
        timestamp: new Date(),
        projectId: messageData.projectId
      });
    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('error', { message: 'Failed to save message' });
    }
  });
  
  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} with WebSocket support`);
    });
  } catch (error) {
    console.error('Could not start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;