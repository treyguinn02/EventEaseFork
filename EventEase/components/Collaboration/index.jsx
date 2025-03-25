import { useState, useEffect, useRef } from 'react';
import './styles.css';

const Collaboration = () => {
  const [messages, setMessages] = useState([
    { id: 1, user: 'John Doe', text: 'Hello team! How is the event planning going?', timestamp: '10:30 AM' },
    { id: 2, user: 'Jane Smith', text: 'I\'ve booked the venue for the conference.', timestamp: '10:32 AM' },
    { id: 3, user: 'Alex Johnson', text: 'Great! I\'ll start working on the marketing materials.', timestamp: '10:35 AM' }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('Guest User');
  const [activeProject, setActiveProject] = useState('Annual Conference 2023');
  const [projects, setProjects] = useState([
    { id: 1, name: 'Annual Conference 2023', collaborators: 5, lastActivity: '10 mins ago' },
    { id: 2, name: 'Product Launch', collaborators: 3, lastActivity: '1 hour ago' },
    { id: 3, name: 'Team Building Event', collaborators: 8, lastActivity: '3 hours ago' }
  ]);
  
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Finalize speaker list', assigned: 'John Doe', status: 'in-progress' },
    { id: 2, text: 'Send invitations to VIPs', assigned: 'Jane Smith', status: 'pending' },
    { id: 3, text: 'Order event supplies', assigned: 'Alex Johnson', status: 'completed' }
  ]);
  
  const [notes, setNotes] = useState('# Event Planning Notes\n\n- Venue capacity: 200 people\n- Budget: $10,000\n- Date: November 15, 2023\n\n## Catering Options\n- Option 1: Full service buffet ($45/person)\n- Option 2: Light refreshments ($25/person)');
  const [activeTab, setActiveTab] = useState('Chat');
  const [newTaskText, setNewTaskText] = useState('');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const users = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Sarah Williams', 'Mike Brown'];
      const randomMessages = [
        'Just updated the budget spreadsheet.',
        'The vendor confirmed availability for our date.',
        'I added some new ideas to the brainstorming doc.',
        'Can someone review the latest marketing materials?',
        'The client approved our latest proposal!'
      ];
      
      if (Math.random() > 0.7) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomText = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 1,
            user: randomUser,
            text: randomText,
            timestamp: timeString
          }
        ]);
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        user: username,
        text: newMessage,
        timestamp: timeString
      }
    ]);
    
    setNewMessage('');
  };
  
  const handleUpdateNotes = (e) => {
    setNotes(e.target.value);
  };
  
  const changeTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };
  
  const switchProject = (projectName) => {
    setActiveProject(projectName);
    // In a real app, you would fetch project-specific data here
  };
  
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    const newTask = {
      id: tasks.length + 1,
      text: newTaskText,
      assigned: username,
      status: 'pending'
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskText('');
    setShowNewTaskForm(false);
  };
  
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    const newProject = {
      id: projects.length + 1,
      name: newProjectName,
      collaborators: 1,
      lastActivity: 'just now'
    };
    
    setProjects([...projects, newProject]);
    setActiveProject(newProjectName);
    setNewProjectName('');
    setShowNewProjectForm(false);
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
      case 'Chat':
        return (
          <div className="chat-panel">
            <div className="messages-container">
              {messages.map(message => (
                <div key={message.id} className={`message ${message.user === username ? 'own-message' : ''}`}>
                  <div className="message-header">
                    <span className="message-user">{message.user}</span>
                    <span className="message-time">{message.timestamp}</span>
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <form className="message-input-form" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Type your message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="message-input"
              />
              <button type="submit" className="send-button">Send</button>
            </form>
          </div>
        );
      case 'Files':
        return (
          <div className="files-panel">
            <h3>Shared Files</h3>
            <div className="file-list">
              <div className="file-item">
                <i className="file-icon">📄</i>
                <span className="file-name">Event Budget.xlsx</span>
                <span className="file-meta">Uploaded by Jane Smith, 2 days ago</span>
              </div>
              <div className="file-item">
                <i className="file-icon">📄</i>
                <span className="file-name">Venue Contract.pdf</span>
                <span className="file-meta">Uploaded by John Doe, 1 week ago</span>
              </div>
              <div className="file-item">
                <i className="file-icon">📄</i>
                <span className="file-name">Marketing Plan.docx</span>
                <span className="file-meta">Uploaded by Alex Johnson, 3 days ago</span>
              </div>
            </div>
            <button className="upload-file-btn">+ Upload File</button>
          </div>
        );
      case 'Timeline':
        return (
          <div className="timeline-panel">
            <h3>Project Timeline</h3>
            <div className="timeline-items">
              <div className="timeline-item">
                <div className="timeline-date">Oct 1, 2023</div>
                <div className="timeline-content">
                  <h4>Project Kickoff</h4>
                  <p>Initial planning meeting and task assignments</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">Oct 15, 2023</div>
                <div className="timeline-content">
                  <h4>Venue Selection</h4>
                  <p>Final venue selection and deposit payment</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">Nov 1, 2023</div>
                <div className="timeline-content">
                  <h4>Marketing Launch</h4>
                  <p>Begin promotional activities and open registrations</p>
                </div>
              </div>
            </div>
            <button className="add-milestone-btn">+ Add Milestone</button>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };
  
  return (
    <div className="collaboration-container">
      <div className="collaboration-header">
        <h2>Real-Time Collaboration Hub</h2>
        <div className="user-info">
          <span className="active-indicator"></span>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="username-input"
          />
        </div>
      </div>
      
      <div className="collaboration-content">
        <div className="projects-sidebar">
          <h3>Projects</h3>
          <div className="project-list">
            {projects.map(project => (
              <div 
                key={project.id} 
                className={`project-item ${project.name === activeProject ? 'active' : ''}`}
                onClick={() => switchProject(project.name)}
              >
                <div className="project-name">{project.name}</div>
                <div className="project-meta">
                  <span>{project.collaborators} collaborators</span>
                  <span>Active {project.lastActivity}</span>
                </div>
              </div>
            ))}
          </div>
          
          {showNewProjectForm ? (
            <form onSubmit={handleAddProject} className="new-project-form">
              <input
                type="text"
                placeholder="Project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="new-project-input"
                autoFocus
              />
              <div className="form-buttons">
                <button type="submit" className="save-btn">Save</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowNewProjectForm(false)}
                >
                  Cancel
                </button>
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
            <h3>{activeProject}</h3>
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
            <h3>Shared Tasks</h3>
            <div className="task-list">
              {tasks.map(task => (
                <div key={task.id} className={`collab-task ${task.status}`}>
                  <div className="task-text">{task.text}</div>
                  <div className="task-meta">
                    <span>Assigned: {task.assigned}</span>
                    <select 
                      value={task.status} 
                      onChange={(e) => changeTaskStatus(task.id, e.target.value)}
                      className="task-status-select"
                    >
                      <option value="pending">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            
            {showNewTaskForm ? (
              <form onSubmit={handleAddTask} className="new-task-form">
                <input
                  type="text"
                  placeholder="Task description..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="new-task-input"
                  autoFocus
                />
                <div className="form-buttons">
                  <button type="submit" className="save-btn">Add</button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowNewTaskForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button 
                className="add-task-btn"
                onClick={() => setShowNewTaskForm(true)}
              >
                + Add Task
              </button>
            )}
          </div>
          
          <div className="notes-section">
            <h3>Shared Notes</h3>
            <textarea 
              className="shared-notes" 
              value={notes}
              onChange={handleUpdateNotes}
              placeholder="Type your notes here..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;
