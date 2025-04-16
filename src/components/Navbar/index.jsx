import { useState } from 'react';
import './styles.css';
import './projectReactor.css';
import './projectCreator.css';

const Navbar = ({ activeTab, setActiveTab, projectName, projects, onProjectChange }) => {
  const [isSelectActive, setIsSelectActive] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isProjectReactorOpen, setIsProjectReactorOpen] = useState(false);
  const [projectsToEdit, setProjectsToEdit] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0], // Default to today
    endDate: '',
    summary: ''
  });
  const handleSignOut = () => {
    // Disable the sign-out button immediately
    const signOutBtn = document.querySelector('.sign-out-btn');
    if (signOutBtn) {
      signOutBtn.disabled = true;
      signOutBtn.textContent = 'Signing out...';
    }

    // Clear user data from localStorage
    localStorage.removeItem('user');
    
    // Add a 2-second delay before reloading
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  
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
  
  const openProjectReactor = () => {
    // Initialize with a copy of the projects data
    setProjectsToEdit(projects.map(project => ({ ...project, isSelected: false })));
    setSelectedProjects([]);
    setIsProjectReactorOpen(true);
  };
  
  const closeProjectReactor = () => {
    setIsProjectReactorOpen(false);
    setProjectsToEdit([]);
    setSelectedProjects([]);
  };
  
  const handleProjectSelection = (projectId) => {
    setProjectsToEdit(prev => prev.map(p => {
      if (p._id === projectId) {
        const isSelected = !p.isSelected;
        // Update selectedProjects based on selection state
        if (isSelected) {
          setSelectedProjects(prevSelected => [...prevSelected, p._id]);
        } else {
          setSelectedProjects(prevSelected => prevSelected.filter(id => id !== p._id));
        }
        return { ...p, isSelected };
      }
      return p;
    }));
  };
  
  const handleBatchDelete = () => {
    if (selectedProjects.length === 0) return;
    
    // Call API to delete selected projects
    // This is a placeholder - we'll need to implement the actual API call
    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedProjects.length} projects?`);
    
    if (confirmDelete) {
      // We'll need to implement this function in the parent component
      // For now, we're just passing the IDs to delete
      onProjectChange('delete-batch', selectedProjects);
      
      // Update local state to remove deleted projects
      setProjectsToEdit(prev => prev.filter(p => !selectedProjects.includes(p._id)));
      setSelectedProjects([]);
    }
  };
  
  const handleProjectEdit = (projectId, field, value) => {
    setProjectsToEdit(prev => prev.map(p => {
      if (p._id === projectId) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };
  
  const saveProjectChanges = (projectId) => {
    const projectToUpdate = projectsToEdit.find(p => p._id === projectId);
    if (projectToUpdate) {
      // Call API to update project
      onProjectChange('update', projectToUpdate);
    }
  };
  
  const saveAllChanges = () => {
    // Call API to update all edited projects
    const changedProjects = projectsToEdit.filter(p => {
      // Find original project
      const originalProject = projects.find(orig => orig._id === p._id);
      // Compare to check if any field is different
      return originalProject && (
        originalProject.name !== p.name ||
        originalProject.startDate !== p.startDate ||
        originalProject.endDate !== p.endDate ||
        originalProject.summary !== p.summary
      );
    });
    
    if (changedProjects.length > 0) {
      // Update all changed projects
      onProjectChange('update-batch', changedProjects);
    }
    
    closeProjectReactor();
  };
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={goToHome}>EventEase</div>
      
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
          <option value="create-new">+ Navigate to Different Project </option>
        </select>
      </div>
      
      <ul className="nav-links">
        <li 
          className={activeTab === 'Calendar' ? 'active' : ''} 
          onClick={() => handleNavClick('Calendar')}
        >          <a href="#Calendar">Calendar</a>
        </li><li 
          className={activeTab === 'Tasks' ? 'active' : ''} 
          onClick={() => handleNavClick('Tasks')}
        >
          <a href="#Tasks">Tasks</a>
        </li>
        <li 
          className={activeTab === 'Collaboration' ? 'active' : ''} 
          onClick={() => handleNavClick('Collaboration')}
        >
          <a href="#Collaboration">Collaboration</a>
        </li>
        <li 
          className={activeTab === 'Guests' ? 'active' : ''} 
          onClick={() => handleNavClick('Guests')}
        >          <a href="#Guests">Guests</a>
        </li>      </ul>
      <div className="user-actions">
        <button 
          className="project-reactor-btn"
          onClick={openProjectReactor}
        >
          Project Reactor
        </button>
        <button 
          className="user-profile-btn"
          onClick={() => handleNavClick('Profile')}
        >
          Profile
        </button>
        <button onClick={handleSignOut} className="sign-out-btn">
          Sign Out
        </button>
      </div>

      {/* Project Reactor Modal */}
      {isProjectReactorOpen && (
        <div className="project-reactor-modal">
          <div className="project-reactor-content">
            <div className="project-reactor-header">
              <h2>Project Reactor</h2>
              <p>Manage multiple projects at once</p>
              <button className="close-modal-btn" onClick={closeProjectReactor}>×</button>
            </div>
            
            <div className="project-reactor-actions">
              <div className="batch-actions">
                <button 
                  className="batch-delete-btn" 
                  onClick={handleBatchDelete}
                  disabled={selectedProjects.length === 0}
                >
                  Delete Selected ({selectedProjects.length})
                </button>
                <button 
                  className="add-project-btn"
                  onClick={() => {
                    closeProjectReactor();
                    setIsCreatingProject(true);
                  }}
                >
                  Create New Project
                </button>
              </div>
              <div className="selection-actions">
                <button 
                  className="select-all-btn"
                  onClick={() => {
                    const allIds = projectsToEdit.map(p => p._id);
                    const allSelected = selectedProjects.length === projectsToEdit.length;
                    
                    if (allSelected) {
                      // Deselect all
                      setSelectedProjects([]);
                      setProjectsToEdit(prev => prev.map(p => ({ ...p, isSelected: false })));
                    } else {
                      // Select all
                      setSelectedProjects(allIds);
                      setProjectsToEdit(prev => prev.map(p => ({ ...p, isSelected: true })));
                    }
                  }}
                >
                  {selectedProjects.length === projectsToEdit.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>
            
            <div className="projects-table-container">
              <table className="projects-table">
                <thead>
                  <tr>
                    <th className="checkbox-column"></th>
                    <th>Project Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Summary</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projectsToEdit.map(project => (
                    <tr key={project._id} className={project.isSelected ? 'selected' : ''}>
                      <td className="checkbox-column">
                        <input 
                          type="checkbox" 
                          checked={project.isSelected}
                          onChange={() => handleProjectSelection(project._id)}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          value={project.name}
                          onChange={(e) => handleProjectEdit(project._id, 'name', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="date" 
                          value={project.startDate}
                          onChange={(e) => handleProjectEdit(project._id, 'startDate', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="date" 
                          value={project.endDate}
                          onChange={(e) => handleProjectEdit(project._id, 'endDate', e.target.value)}
                        />
                      </td>
                      <td>
                        <textarea 
                          value={project.summary}
                          onChange={(e) => handleProjectEdit(project._id, 'summary', e.target.value)}
                          rows="2"
                        />
                      </td>
                      <td>
                        <button 
                          className="save-project-btn"
                          onClick={() => saveProjectChanges(project._id)}
                        >
                          Save
                        </button>
                        <button 
                          className="delete-project-btn"
                          onClick={() => {
                            const confirmDelete = window.confirm(`Are you sure you want to delete ${project.name}?`);
                            if (confirmDelete) {
                              onProjectChange('delete', project._id);
                              setProjectsToEdit(prev => prev.filter(p => p._id !== project._id));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="project-reactor-footer">
              <button className="save-all-btn" onClick={saveAllChanges}>Save All Changes</button>
              <button className="cancel-btn" onClick={closeProjectReactor}>Cancel</button>
            </div>          </div>
        </div>
      )}

      {/* Project Creator Modal */}
      {isCreatingProject && (
        <div className="project-creator-modal">
          <div className="project-creator-content">
            <div className="project-creator-header">
              <h2>Create New Project</h2>
              <p>Enter project details below</p>
              <button className="close-modal-btn" onClick={cancelCreateProject}>×</button>
            </div>
            <div className="project-creator">
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
          </div>
        </div>
      )}
    </nav>  );
};

export default Navbar;
