import { useState, useEffect, useRef } from 'react';
import './styles.css';
import { 
  messageService, 
  projectService, 
  taskService, 
  noteService, 
  fileService,
  milestoneService 
} from '../../services/api';

const Collaboration = () => {
  // State for messages, projects, tasks, etc.
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('Guest User');
  const [activeProject, setActiveProject] = useState('');
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('Chat');
  const [newTaskText, setNewTaskText] = useState('');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  
  // State for files
  const [files, setFiles] = useState([]);
  const [showFileUploadForm, setShowFileUploadForm] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [fileUploadError, setFileUploadError] = useState('');

  // State for milestones
  const [milestones, setMilestones] = useState([]);
  const [showAddMilestoneForm, setShowAddMilestoneForm] = useState(false);
  const [newMilestoneDate, setNewMilestoneDate] = useState('');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDescription, setNewMilestoneDescription] = useState('');
  
  // Loading states
  const [loading, setLoading] = useState({
    projects: true,
    messages: false,
    tasks: false,
    files: false,
    milestones: false
  });
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);
  
  // When activeProjectId changes, fetch related data
  useEffect(() => {
    if (activeProjectId) {
      fetchMessages(activeProjectId);
      fetchTasks(activeProjectId);
      fetchFiles(activeProjectId);
      fetchMilestones(activeProjectId);
      fetchNotes(activeProjectId);
    }
  }, [activeProjectId]);
  
  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(prev => ({ ...prev, projects: true }));
      const response = await projectService.getAll();
      const projectsData = response.data;
      
      setProjects(projectsData.map(project => ({
        id: project._id,
        name: project.name,
        collaborators: project.members ? project.members.length : 0,
        lastActivity: formatTimestamp(project.lastActivity)
      })));
      
      // Set active project if projects exist
      if (projectsData.length > 0) {
        setActiveProject(projectsData[0].name);
        setActiveProjectId(projectsData[0]._id);
      }
      
      setLoading(prev => ({ ...prev, projects: false }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(prev => ({ ...prev, projects: false }));
    }
  };
  
  // Fetch messages for a project
  const fetchMessages = async (projectId) => {
    try {
      setLoading(prev => ({ ...prev, messages: true }));
      const response = await messageService.getByProject(projectId);
      
      setMessages(response.data.map(message => ({
        id: message._id,
        user: message.userId?.username || 'Unknown User', // Assuming user details are populated
        text: message.text,
        timestamp: formatTimestamp(message.timestamp)
      })));
      
      setLoading(prev => ({ ...prev, messages: false }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(prev => ({ ...prev, messages: false }));
    }
  };
  
  // Fetch tasks for a project
  const fetchTasks = async (projectId) => {
    try {
      setLoading(prev => ({ ...prev, tasks: true }));
      const response = await taskService.getByProject(projectId);
      
      setTasks(response.data.map(task => ({
        id: task._id,
        text: task.text,
        assigned: task.assignedTo?.username || 'Unassigned', // Assuming user details are populated
        status: task.status
      })));
      
      setLoading(prev => ({ ...prev, tasks: false }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  };
  
  // Fetch notes for a project
  const fetchNotes = async (projectId) => {
    try {
      const response = await noteService.getByProject(projectId);
      // For simplicity, just getting the first note's content (if it exists)
      const projectNotes = response.data;
      if (projectNotes.length > 0) {
        setNotes(projectNotes[0].content);
      } else {
        setNotes('# Event Planning Notes\n\n- Add your notes here');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };
  
  // Fetch files for a project
  const fetchFiles = async (projectId) => {
    try {
      setLoading(prev => ({ ...prev, files: true }));
      const response = await fileService.getByProject(projectId);
      
      setFiles(response.data.map(file => ({
        id: file._id,
        name: file.name,
        uploadedBy: file.uploadedBy?.username || 'Unknown User', // Assuming user details are populated
        uploadedTime: formatTimestamp(file.uploadedAt),
        icon: '📄'
      })));
      
      setLoading(prev => ({ ...prev, files: false }));
    } catch (error) {
      console.error('Error fetching files:', error);
      setLoading(prev => ({ ...prev, files: false }));
    }
  };
  
  // Fetch milestones for a project
  const fetchMilestones = async (projectId) => {
    try {
      setLoading(prev => ({ ...prev, milestones: true }));
      const response = await milestoneService.getByProject(projectId);
      
      setMilestones(response.data.map(milestone => ({
        id: milestone._id,
        date: formatDate(milestone.date),
        title: milestone.title,
        description: milestone.description
      })));
      
      setLoading(prev => ({ ...prev, milestones: false }));
    } catch (error) {
      console.error('Error fetching milestones:', error);
      setLoading(prev => ({ ...prev, milestones: false }));
    }
  };
  
  // Helper function to format timestamps
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    
    return date.toLocaleDateString();
  };
  
  // Helper function to format dates
  const formatDate = (date) => {
    if (!date) return 'No date set';
    
    const dateObj = new Date(date);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  };
  
  // Send a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeProjectId) return;
    
    try {
      // Create message data object
      const messageData = {
        projectId: activeProjectId,
        text: newMessage,
        userId: 'tempUserId', // This would be the actual user ID in a real app
        timestamp: new Date()
      };
      
      // Save to database
      const response = await messageService.create(messageData);
      
      // Add to local state
      setMessages([
        ...messages,
        {
          id: response.data._id,
          user: username,
          text: newMessage,
          timestamp: 'just now'
        }
      ]);
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Update notes
  const handleUpdateNotes = async (e) => {
    setNotes(e.target.value);
    
    try {
      // For simplicity, just creating or updating a single note for the project
      // In a real app, you'd likely have more complex note management
      const noteData = {
        projectId: activeProjectId,
        title: 'Project Notes',
        content: e.target.value,
        createdBy: 'tempUserId' // This would be the actual user ID in a real app
      };
      
      // Check if notes exist for this project
      const response = await noteService.getByProject(activeProjectId);
      if (response.data.length > 0) {
        // Update existing note
        await noteService.update(response.data[0]._id, noteData);
      } else {
        // Create new note
        await noteService.create(noteData);
      }
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };
  
  // Change task status
  const changeTaskStatus = async (taskId, newStatus) => {
    try {
      // Update in database
      await taskService.updateStatus(taskId, newStatus);
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  
  // Switch active project
  const switchProject = (projectId, projectName) => {
    setActiveProject(projectName);
    setActiveProjectId(projectId);
  };
  
  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim() || !activeProjectId) return;
    
    try {
      // Create task data object
      const taskData = {
        projectId: activeProjectId,
        text: newTaskText,
        createdBy: 'tempUserId', // This would be the actual user ID in a real app
        status: 'pending'
      };
      
      // Save to database
      const response = await taskService.create(taskData);
      
      // Add to local state
      setTasks([
        ...tasks, 
        {
          id: response.data._id,
          text: newTaskText,
          assigned: username,
          status: 'pending'
        }
      ]);
      
      setNewTaskText('');
      setShowNewTaskForm(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  
  // Add a new project
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    try {
      // Create project data object
      const projectData = {
        name: newProjectName,
        createdBy: 'tempUserId', // This would be the actual user ID in a real app
        members: [{ userId: 'tempUserId', role: 'Owner' }]
      };
      
      // Save to database
      const response = await projectService.create(projectData);
      
      // Add to local state
      const newProject = {
        id: response.data._id,
        name: newProjectName,
        collaborators: 1,
        lastActivity: 'just now'
      };
      
      setProjects([...projects, newProject]);
      setActiveProject(newProjectName);
      setActiveProjectId(response.data._id);
      setNewProjectName('');
      setShowNewProjectForm(false);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };
  
  // Upload a file
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!newFile || !newFileName.trim() || !activeProjectId) {
      setFileUploadError('Please select a file and provide a name.');
      return;
    }
    
    try {
      // In a real application, you would use FormData to upload the actual file
      // For this exercise, we'll just save the file metadata
      const fileData = {
        projectId: activeProjectId,
        name: newFileName,
        fileUrl: 'https://example.com/placeholder-url', // Placeholder URL
        uploadedBy: 'tempUserId', // This would be the actual user ID in a real app
        uploadedAt: new Date(),
        fileType: newFile.type,
        fileSize: newFile.size
      };
      
      // Save to database
      const response = await fileService.upload(fileData);
      
      // Add to local state
      setFiles([
        ...files, 
        {
          id: response.data._id,
          name: newFileName,
          uploadedBy: username,
          uploadedTime: 'just now',
          icon: '📄'
        }
      ]);
      
      setNewFile(null);
      setNewFileName('');
      setShowFileUploadForm(false);
      setFileUploadError('');
    } catch (error) {
      console.error('Error uploading file:', error);
      setFileUploadError('Error uploading file. Please try again.');
    }
  };
  
  // Add a milestone
  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestoneDate.trim() || !newMilestoneTitle.trim() || !newMilestoneDescription.trim() || !activeProjectId) return;
    
    try {
      // Create milestone data object
      const milestoneData = {
        projectId: activeProjectId,
        title: newMilestoneTitle,
        description: newMilestoneDescription,
        date: new Date(newMilestoneDate),
        status: 'planned',
        createdBy: 'tempUserId' // This would be the actual user ID in a real app
      };
      
      // Save to database
      const response = await milestoneService.create(milestoneData);
      
      // Add to local state
      setMilestones([
        ...milestones, 
        {
          id: response.data._id,
          date: formatDate(newMilestoneDate),
          title: newMilestoneTitle,
          description: newMilestoneDescription
        }
      ]);
      
      setNewMilestoneDate('');
      setNewMilestoneTitle('');
      setNewMilestoneDescription('');
      setShowAddMilestoneForm(false);
    } catch (error) {
      console.error('Error adding milestone:', error);
    }
  };
  
  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Chat':
        return (
          <div className="chat-panel">
            <div className="messages-container">
              {loading.messages ? (
                <p>Loading messages...</p>
              ) : (
                messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`message ${message.user === username ? 'own-message' : ''}`}
                  >
                    <div className="message-header">
                      <span className="message-user">{message.user}</span>
                      <span className="message-time">{message.timestamp}</span>
                    </div>
                    <p className="message-text">{message.text}</p>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <form className="message-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="message-input"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                required
              />
              <button type="submit" className="send-button">Send</button>
            </form>
          </div>
        );
      
      case 'Files':
        return (
          <div className="files-panel">
            {loading.files ? (
              <p>Loading files...</p>
            ) : (
              <div className="file-list">
                {files.map(file => (
                  <div key={file.id} className="file-item">
                    <div className="file-name">
                      <span className="file-icon">{file.icon}</span>
                      {file.name}
                    </div>
                    <div className="file-meta">
                      Uploaded by: {file.uploadedBy} · {file.uploadedTime}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button 
              className="upload-file-btn"
              onClick={() => setShowFileUploadForm(true)}
            >
              + Upload File
            </button>
            
            {showFileUploadForm && (
              <div className="file-upload-form">
                <form onSubmit={handleFileUpload}>
                  {fileUploadError && <div className="error-message">{fileUploadError}</div>}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="file-input"
                    onChange={(e) => setNewFile(e.target.files[0])}
                  />
                  <input 
                    type="text"
                    className="file-name-input"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="File name"
                    required
                  />
                  <div className="form-buttons">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => {
                        setShowFileUploadForm(false);
                        setNewFile(null);
                        setNewFileName('');
                        setFileUploadError('');
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="upload-btn">Upload</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        );
      
      case 'Timeline':
        return (
          <div className="timeline-panel">
            {loading.milestones ? (
              <p>Loading timeline...</p>
            ) : (
              <div className="timeline-items">
                {milestones.map(milestone => (
                  <div key={milestone.id} className="timeline-item">
                    <div className="timeline-date">{milestone.date}</div>
                    <div className="timeline-content">
                      <h4>{milestone.title}</h4>
                      <p>{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button 
              className="add-milestone-btn"
              onClick={() => setShowAddMilestoneForm(true)}
            >
              + Add Milestone
            </button>
            
            {showAddMilestoneForm && (
              <div className="add-milestone-form">
                <form onSubmit={handleAddMilestone}>
                  <input 
                    type="date"
                    className="milestone-date-input"
                    value={newMilestoneDate}
                    onChange={(e) => setNewMilestoneDate(e.target.value)}
                    required
                  />
                  <input 
                    type="text"
                    className="milestone-title-input"
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    placeholder="Milestone title"
                    required
                  />
                  <textarea 
                    className="milestone-description-input"
                    value={newMilestoneDescription}
                    onChange={(e) => setNewMilestoneDescription(e.target.value)}
                    placeholder="Description"
                    required
                  />
                  <div className="form-buttons">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => {
                        setShowAddMilestoneForm(false);
                        setNewMilestoneDate('');
                        setNewMilestoneTitle('');
                        setNewMilestoneDescription('');
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="add-btn">Add</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="collaboration-container">
      <div className="collaboration-header">
        <h2>EventEase Collaboration Hub</h2>
        <div className="user-info">
          <span className="active-indicator"></span>
          <input
            type="text"
            className="username-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Your name"
          />
        </div>
      </div>
      
      <div className="collaboration-content">
        <div className="projects-sidebar">
          <h3>Your Projects</h3>
          <div className="project-list">
            {loading.projects ? (
              <p>Loading projects...</p>
            ) : (
              projects.map(project => (
                <div
                  key={project.id}
                  className={`project-item ${project.name === activeProject ? 'active' : ''}`}
                  onClick={() => switchProject(project.id, project.name)}
                >
                  <div className="project-name">{project.name}</div>
                  <div className="project-meta">
                    <span>{project.collaborators} collaborators</span>
                    <span>{project.lastActivity}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {showNewProjectForm ? (
            <form onSubmit={handleAddProject}>
              <input
                type="text"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                placeholder="Project name"
                required
                autoFocus
              />
              <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewProjectForm(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1 }}>Create</button>
              </div>
            </form>
          ) : (
            <button
              className="new-project-btn"
              onClick={() => setShowNewProjectForm(true)}
            >
              + New Project
            </button>
          )}
        </div>
        
        <div className="main-collaboration-area">
          <div className="project-header">
            <h3>{activeProject || 'Select a Project'}</h3>
            <div className="collaboration-tabs">
              <button
                className={`tab-btn ${activeTab === 'Chat' ? 'active' : ''}`}
                onClick={() => setActiveTab('Chat')}
              >
                Chat
              </button>
              <button
                className={`tab-btn ${activeTab === 'Files' ? 'active' : ''}`}
                onClick={() => setActiveTab('Files')}
              >
                Files
              </button>
              <button
                className={`tab-btn ${activeTab === 'Timeline' ? 'active' : ''}`}
                onClick={() => setActiveTab('Timeline')}
              >
                Timeline
              </button>
            </div>
          </div>
          
          <div className="collaboration-panels">
            {renderTabContent()}
          </div>
        </div>
        
        <div className="collaboration-sidebar">
          <div className="tasks-section">
            <h3>Tasks</h3>
            <div className="task-list">
              {tasks.map(task => (
                <div key={task.id} className={`collab-task ${task.status}`}>
                  <div className="task-text">{task.text}</div>
                  <div className="task-meta">
                    <span>Assigned: {task.assigned}</span>
                    <select
                      className="task-status-select"
                      value={task.status}
                      onChange={e => changeTaskStatus(task.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            
            {showNewTaskForm ? (
              <form onSubmit={handleAddTask}>
                <input
                  type="text"
                  value={newTaskText}
                  onChange={e => setNewTaskText(e.target.value)}
                  placeholder="Task description"
                  required
                  autoFocus
                />
                <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                  <button
                    type="button"
                    onClick={() => setShowNewTaskForm(false)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button type="submit" style={{ flex: 1 }}>Add</button>
                </div>
              </form>
            ) : (
              <div 
                className="add-task-btn"
                onClick={() => setShowNewTaskForm(true)}
              >
                + Add Task
              </div>
            )}
          </div>
          
          <div className="notes-section">
            <h3>Shared Notes</h3>
            <textarea
              className="shared-notes"
              value={notes}
              onChange={handleUpdateNotes}
              placeholder="Add project notes here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;
