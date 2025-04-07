import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle connection refused errors
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.warn('API server connection failed. Make sure the backend server is running.');
      // Return a resolved promise with mock data to prevent app crashes
      return Promise.resolve({
        data: { 
          message: 'Server unavailable',
          mockData: true,
          items: []
        }
      });
    }
    return Promise.reject(error);
  }
);

// Define API services for each entity
export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`)
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