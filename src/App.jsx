import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Calendar from './components/Calendar';
import TaskList from './components/TaskList';
import Collaboration from './components/Collaboration';
import GuestManagement from './components/GuestManagement';
import Documentation from './components/Documentation';
import Login from './components/Login';
import AccountCreation from './components/AccountCreation';
import User from './components/User';
import { projectService, taskService } from './services/api';

function App() {
  // Initialize activeTab based on URL hash
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.slice(1);
    return hash || 'Home';
  });

  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);  const [user, setUser] = useState(null); // State to track the logged-in user
  const [usingMockData, setUsingMockData] = useState(false);
  const [showAccountCreation, setShowAccountCreation] = useState(false); // State to track if account creation page is active

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

  // Add task management functions
  const addTask = async (taskText) => {
    try {
      if (!activeProject || !taskText.trim()) return;
      
      const taskData = {
        projectId: activeProject._id,
        text: taskText,
        status: 'pending',
        priority: 'medium',
        dueDate: null
      };
      
      const response = await taskService.create(taskData);
      const newTask = response.data;
      
      setTasks([
        ...tasks,
        {
          id: newTask._id,
          text: newTask.text,
          completed: false,
          status: newTask.status,
          priority: newTask.priority,
          dueDate: newTask.dueDate
        }
      ]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const newStatus = task.completed ? 'pending' : 'completed';
      await taskService.updateStatus(taskId, newStatus);
      
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed, status: newStatus } 
          : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };  // Render the appropriate content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <Home setActiveTab={setActiveTab} />;
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
        return <GuestManagement 
          guests={guests}
          onAddGuest={addGuest}
          onDeleteGuest={deleteGuest}
          onUpdateGuestStatus={updateGuestStatus}
        />;
      case 'Documentation':
        return <Documentation />;
      case 'Profile':
        return <User userData={user} />;
      default:
        return <Home setActiveTab={setActiveTab}/>;
    }
  };  // If the user is not logged in, show the Login screen or Account Creation
  if (!user) {
    if (showAccountCreation) {
      return (
        <AccountCreation 
          onAccountCreated={(userData) => {
            // After account creation, save user data and redirect to Home page
            const userProfile = {
              profile: {
                name: userData.name,
                given_name: userData.firstName,
                family_name: userData.lastName,
                email: userData.email
              },
              token: 'user-created-token'
            };
            setUser(userProfile);
            localStorage.setItem('user', JSON.stringify(userProfile)); // Persist login
            setActiveTab('Home');
          }}
          onCancel={() => setShowAccountCreation(false)} // Allow going back to login
        />
      );
    } else {
      return (
        <Login
          onLoginSuccess={(userData) => {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData)); // Persist login
          }}
          onSignup={() => setShowAccountCreation(true)} // Show account creation when signup is clicked
        />
      );
    }
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
