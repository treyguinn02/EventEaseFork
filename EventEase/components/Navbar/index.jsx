import { useState } from 'react';
import './styles.css';

const Navbar = ({ activeTab, setActiveTab, projectName, projects, onProjectChange }) => {
  const [isSelectActive, setIsSelectActive] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  
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
  
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      // Call the parent component's function to create a new project
      onProjectChange('new', newProjectName.trim());
      setNewProjectName('');
      setIsCreatingProject(false);
    }
  };
  
  const cancelCreateProject = () => {
    setIsCreatingProject(false);
    setNewProjectName('');
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
          <form onSubmit={handleCreateProject}>
            <input
              type="text"
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              autoFocus
            />
            <div className="project-creator-buttons">
              <button type="submit" className="create-btn">Create</button>
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