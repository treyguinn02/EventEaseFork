import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimer = null;
    this.url = '';
  }

  connect(url = 'http://localhost:5000') {
    this.url = url;
    
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(url);

    // Set up event handlers
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this._notifyListeners('connection_status', { connected: true });
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
      this._notifyListeners('connection_status', { connected: false });
      this._attemptReconnect();
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      this._notifyListeners('error', error);
    });

    this.socket.on('new_message', (message) => {
      console.log('New message received:', message);
      this._notifyListeners('new_message', message);
    });

    return this;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    // Clear any pending reconnect attempt
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  joinProject(projectId) {
    if (!this.socket || !this.isConnected) {
      console.warn('Cannot join project: WebSocket not connected');
      return false;
    }

    console.log('Joining project:', projectId);
    this.socket.emit('join_project', projectId);
    return true;
  }

  sendMessage(messageData) {
    if (!this.socket || !this.isConnected) {
      console.warn('Cannot send message: WebSocket not connected');
      return false;
    }

    console.log('Sending message:', messageData);
    this.socket.emit('chat_message', messageData);
    return true;
  }

  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    
    return () => this.removeListener(event, callback);
  }

  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  _notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  _attemptReconnect() {
    // Clear any existing reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached. Giving up.');
      this._notifyListeners('connection_status', { 
        connected: false, 
        error: 'Max reconnection attempts reached'
      });
      return;
    }

    this.reconnectAttempts++;
    
    // Exponential backoff for reconnect attempts
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.log(`Attempting to reconnect in ${delay}ms... (Attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      if (!this.isConnected) {
        console.log(`Reconnecting... (Attempt ${this.reconnectAttempts})`);
        this.connect(this.url);
      }
    }, delay);
  }

  // Helper method to check connection status
  isSocketConnected() {
    return this.isConnected;
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService;
