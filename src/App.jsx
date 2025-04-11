import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Calendar from './components/Calendar';
import TaskList from './components/TaskList';
import Collaboration from './components/Collaboration';
import GuestManagement from './components/GuestManagement';
import Login from './components/Login';
import { projectService, taskService } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // State to track the logged-in user
  const [usingMockData, setUsingMockData] = useState(false);

  // Add guests state for persistent guest management
  const [guests, setGuests] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'confirmed',
    },
  ]);

  // Load user from local storage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Guest management functions
  const addGuest = (newGuest) => {
    const guestToAdd = {
      id: guests.length > 0 ? Math.max(...guests.map((g) => g.id)) + 1 : 1,
      ...newGuest,
    };
    setGuests([...guests, guestToAdd]);
  };

  const deleteGuest = (id) => {
    setGuests(guests.filter((guest) => guest.id !== id));
  };

  const updateGuestStatus = (id, newStatus) => {
    setGuests(
      guests.map((guest) =>
        guest.id === id ? { ...guest, status: newStatus } : guest
      )
    );
  };

  // Fetch projects and tasks when the component mounts
  useEffect(() => {
    if (!user) return; // Only fetch data if the user is logged in

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch projects
        const projectsResponse = await projectService.getAll();
        const projectsData = projectsResponse.data;
        setProjects(projectsData);

        // Check if we're using mock data
        if (projectsResponse.isMockData) {
          setUsingMockData(true);
        }

        // Set active project if projects exist
        if (projectsData.length > 0) {
          setActiveProject(projectsData[0]);

          // Fetch tasks for the active project
          fetchProjectTasks(projectsData[0]._id);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); // Add user as dependency

  // Fetch tasks for a specific project
  const fetchProjectTasks = async (projectId) => {
    try {
      const response = await taskService.getByProject(projectId);

      // Transform tasks data for the UI
      setTasks(
        response.data.map((task) => ({
          id: task._id,
          text: task.text,
          completed: task.status === 'completed',
          status: task.status,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          priority: task.priority || 'medium',
        }))
      );

      // Create events from tasks with due dates
      const eventsFromTasks = response.data
        .filter((task) => task.dueDate)
        .map((task) => ({
          id: task._id,
          title: task.text,
          start: new Date(task.dueDate),
          end: new Date(
            new Date(task.dueDate).setHours(
              new Date(task.dueDate).getHours() + 1
            )
          ),
          type: 'task',
          status: task.status,
        }));

      setEvents(eventsFromTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Handle changing the active project
  const handleProjectChange = (projectId, newProjectName) => {
    // Handle creation of a new project
    if (projectId === 'new' && newProjectName) {
      createNewProject(newProjectName);
      return;
    }

    // Handle selection of an existing project
    const project = projects.find((p) => p._id === projectId);
    if (project) {
      setActiveProject(project);
      fetchProjectTasks(projectId);
    }
  };

  // Create a new project
  const createNewProject = async (projectName) => {
    try {
      setLoading(true);

      // Create new project via API
      const projectData = {
        name: projectName,
        description: `Project created on ${new Date().toLocaleDateString()}`,
        createdBy: 'tempUserId', // This would be the actual user ID in a real app
        members: ['tempUserId'],
      };

      const response = await projectService.create(projectData);
      const newProject = response.data;

      // Update projects list and set the new project as active
      setProjects([...projects, newProject]);
      setActiveProject(newProject);
      setTasks([]);
      setEvents([]);

      setLoading(false);
    } catch (error) {
      console.error('Error creating new project:', error);
      setLoading(false);
    }
  };

  // Render the appropriate content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <Home />;
      case 'Calendar':
        return <Calendar events={events} />;
      case 'Tasks':
        return (
          <TaskList
            tasks={tasks}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        );
      case 'Collaboration':
        return <Collaboration />;
      case 'Guests':
        return <GuestManagement />;
      default:
        return <Home />;
    }
  };

  // If the user is not logged in, show the Login screen
  if (!user) {
    return (
      <Login
        onLoginSuccess={(userData) => {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData)); // Persist login
        }}
      />
    );
  }

  return (
    <div className="app">
      {usingMockData && (
        <div className="mock-data-notification">
          ⚠️ Using mock data. Backend server is not running or not accessible.
        </div>
      )}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projectName={activeProject?.name || 'No Project Selected'}
        projects={projects}
        onProjectChange={handleProjectChange}
      />
      <main className="app-content">
        {loading ? (
          <div className="loading">Loading application data...</div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
}

export default App;
