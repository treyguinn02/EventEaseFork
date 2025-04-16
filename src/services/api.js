import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000 // Add a timeout to prevent long waiting periods
});

// Mock data to use when server is unavailable
const mockData = {
  projects: [
    { 
      _id: 'mock-project-1', 
      name: 'Sample Project 1', 
      description: 'This is a mock project',
      startDate: '2025-04-01',
      endDate: '2025-05-15',
      createdBy: 'user1',
      members: ['user1'] 
    },
    { 
      _id: 'mock-project-2', 
      name: 'Sample Project 2', 
      description: 'Another mock project',
      startDate: '2025-04-10',
      endDate: '2025-06-20',
      createdBy: 'user1',
      members: ['user1'] 
    }
  ],
  users: [],
  tasks: [],
  messages: [],
  files: [],
  notes: [],
  milestones: []
};

// Add request interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.log('API Error intercepted:', error.message);
    
    // Enhanced error handling to catch all connection-related errors including ECONNREFUSED
    if (
      error.code === 'ECONNABORTED' || 
      error.code === 'ECONNREFUSED' ||
      (error.message && (
        error.message.includes('Network Error') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('Connection refused') ||
        error.message.includes('connect ECONNREFUSED')
      )) ||
      !error.response
    ) {
      console.warn('API server connection failed. Using mock data instead. Make sure the backend server is running for real data.');
      
      // Extract endpoint from the URL to determine what mock data to return
      let mockResponse = { items: [] };
      const url = error.config?.url || '';
      
      if (url.includes('/projects')) {
        mockResponse = { data: mockData.projects };
      } else if (url.includes('/users')) {
        mockResponse = { data: mockData.users };
      } else if (url.includes('/tasks')) {
        mockResponse = { data: mockData.tasks };
      } else if (url.includes('/messages')) {
        mockResponse = { data: mockData.messages };
      } else if (url.includes('/files')) {
        mockResponse = { data: mockData.files };
      } else if (url.includes('/notes')) {
        mockResponse = { data: mockData.notes };
      } else if (url.includes('/milestones')) {
        mockResponse = { data: mockData.milestones };
      }
      
      // Return a resolved promise with mock data to prevent app crashes
      return Promise.resolve({
        data: mockResponse.data,
        config: error.config,
        isMockData: true
      });
    }
    
    return Promise.reject(error);
  }
);

// Define API services for each entity
export const userService = {
  // Authentication endpoints
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  
  // User profile endpoints
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  getCurrentUser: () => api.get('/users/me'),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  updateProfile: (profileData) => api.put(`/users/${profileData.id}`, profileData),
  updateSettings: (settingsData) => api.put(`/users/${settingsData.id}/settings`, settingsData.settings),
  changePassword: (id, passwordData) => api.put(`/users/${id}/password`, passwordData),
  delete: (id) => api.delete(`/users/${id}`),
  deleteAccount: (id) => api.delete(`/users/${id}`),
  uploadAvatar: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    return api.post(`/users/${formData.get('userId')}/avatar`, formData, config);
  },
  
  // Helper to set auth token for all requests
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
    }
  }
};

export const projectService = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  getByUser: (userId) => api.get(`/projects/user/${userId}`),
  create: (projectData) => api.post('/projects', projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  delete: (id) => api.delete(`/projects/${id}`),
  addMember: (projectId, memberData) => api.post(`/projects/${projectId}/members`, memberData),
  removeMember: (projectId, userId) => api.delete(`/projects/${projectId}/members/${userId}`)
};

export const messageService = {
  getAll: () => api.get('/messages'),
  getByProject: (projectId) => api.get(`/messages/project/${projectId}`),
  getById: (id) => api.get(`/messages/${id}`),
  create: (messageData) => api.post('/messages', messageData),
  update: (id, messageData) => api.put(`/messages/${id}`, messageData),
  markAsRead: (messageId, userId) => api.patch(`/messages/${messageId}/read/${userId}`),
  delete: (id) => api.delete(`/messages/${id}`)
};

export const taskService = {
  getAll: () => api.get('/tasks'),
  getByProject: (projectId) => api.get(`/tasks/project/${projectId}`),
  getByAssignee: (userId) => api.get(`/tasks/assignee/${userId}`),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  delete: (id) => api.delete(`/tasks/${id}`)
};

export const fileService = {
  getAll: () => api.get('/files'),
  getByProject: (projectId) => api.get(`/files/project/${projectId}`),
  getById: (id) => api.get(`/files/${id}`),
  upload: (fileData) => api.post('/files', fileData),
  update: (id, fileData) => api.put(`/files/${id}`, fileData),
  addVersion: (id, versionData) => api.post(`/files/${id}/versions`, versionData),
  delete: (id) => api.delete(`/files/${id}`)
};

export const noteService = {
  getAll: () => api.get('/notes'),
  getByProject: (projectId) => api.get(`/notes/project/${projectId}`),
  getByCreator: (userId) => api.get(`/notes/creator/${userId}`),
  getSharedWithUser: (userId) => api.get(`/notes/shared/${userId}`),
  getById: (id) => api.get(`/notes/${id}`),
  create: (noteData) => api.post('/notes', noteData),
  update: (id, noteData, editorId) => api.put(`/notes/${id}`, { ...noteData, editorId }),
  share: (noteId, userIds) => api.post(`/notes/${noteId}/share`, { userIds }),
  unshare: (noteId, userId) => api.delete(`/notes/${noteId}/share/${userId}`),
  delete: (id) => api.delete(`/notes/${id}`)
};

export const milestoneService = {
  getAll: () => api.get('/milestones'),
  getByProject: (projectId) => api.get(`/milestones/project/${projectId}`),
  getUpcoming: (projectId) => api.get(`/milestones/project/${projectId}/upcoming`),
  getById: (id) => api.get(`/milestones/${id}`),
  create: (milestoneData) => api.post('/milestones', milestoneData),
  update: (id, milestoneData) => api.put(`/milestones/${id}`, milestoneData),
  updateStatus: (id, status) => api.patch(`/milestones/${id}/status`, { status }),
  delete: (id) => api.delete(`/milestones/${id}`)
};