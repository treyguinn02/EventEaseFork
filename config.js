/**
 * EventEase Application Configuration
 * 
 * This file manages configuration settings for the EventEase application.
 */

require('dotenv').config();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  server: {
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'development'
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'eventease-secret-key',
    jwtExpiration: process.env.JWT_EXPIRATION || '1d'
  }
};