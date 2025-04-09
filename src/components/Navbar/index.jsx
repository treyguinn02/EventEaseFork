import { useState } from 'react';
import './styles.css';

const Navbar = ({ activeTab, setActiveTab, projectName, projects, onProjectChange }) => {
  const [isSelectActive, setIsSelectActive] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0], // Default to today
    endDate: '',
    summary: ''
  });
  
  const handleNavClick = (tab) => {
    setActiveTab(tab);
  };

  const goToHome = () => {
    setActiveTab('Home');
  };
  
  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === 'create-new') {
      setIsCreatingProject(true);
    } else {
      onProjectChange(value);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (newProject.name.trim()) {
      // Call the parent component's function to create a new project with all data
      onProjectChange('new', newProject);
      // Reset form
      setNewProject({
        name: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        summary: ''
      });
      setIsCreatingProject(false);
      // Redirect to Tasks tab
      setActiveTab('Tasks');
    }
  };
  
  const cancelCreateProject = () => {
    setIsCreatingProject(false);
    setNewProject({
      name: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      summary: ''
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={goToHome}>EventEase</div>
      
      {!isCreatingProject ? (
        <div className={`project-selector ${isSelectActive ? 'active' : ''}`}>
          <span>Project: </span>
          <select 
            value={projects.find(p => p.name === projectName)?._id || ''}
            onChange={handleSelectChange}
            onFocus={() => setIsSelectActive(true)}
            onBlur={() => setIsSelectActive(false)}
          >
            {projects.map(project => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
            <option value="create-new">+ Create New Project</option>
          </select>
        </div>
      ) : (
        <div className="project-creator">
          <h3>Create New Project</h3>
          <form onSubmit={handleCreateProject}>
            <div className="form-group">
              <label htmlFor="project-name">Project Name</label>
              <input
                id="project-name"
                type="text"
                name="name"
                placeholder="Enter project name"
                value={newProject.name}
                onChange={handleInputChange}
                autoFocus
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start-date">Start Date</label>
                <input
                  id="start-date"
                  type="date"
                  name="startDate"
                  value={newProject.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="end-date">Projected End Date</label>
                <input
                  id="end-date"
                  type="date"
                  name="endDate"
                  value={newProject.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="project-summary">Project Summary</label>
              <textarea
                id="project-summary"
                name="summary"
                placeholder="Brief description of the project"
                value={newProject.summary}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
            
            <div className="project-creator-buttons">
              <button type="submit" className="create-btn">Create & Go to Tasks</button>
              <button type="button" className="cancel-btn" onClick={cancelCreateProject}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      <ul className="nav-links">
        <li 
          className={activeTab === 'Calendar' ? 'active' : ''} 
          onClick={() => handleNavClick('Calendar')}
        >
          <a href="#calendar">Calendar</a>
        </li>
        <li 
          className={activeTab === 'Tasks' ? 'active' : ''} 
          onClick={() => handleNavClick('Tasks')}
        >
          <a href="#tasks">Tasks</a>
        </li>
        <li 
          className={activeTab === 'Collaboration' ? 'active' : ''} 
          onClick={() => handleNavClick('Collaboration')}
        >
          <a href="#collaboration">Collaboration</a>
        </li>
        <li 
          className={activeTab === 'Guests' ? 'active' : ''} 
          onClick={() => handleNavClick('Guests')}
        >
          <a href="#guests">Guests</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;