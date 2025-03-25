import { useState } from 'react';
import Navbar from './components/Navbar';
import TaskList from './components/TaskList';
import Calendar from './components/Calendar';
import GuestManagement from './components/GuestManagement';
import Collaboration from './components/Collaboration';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch(activeTab) {
      case 'events':
        return <TaskList />;
      case 'calendar':
        return <Calendar />;
      case 'guests':
        return <GuestManagement />;
      case 'collaborate':
        return <Collaboration />;
      case 'home':
      default:
        return (
          <div className="home-container">
            <h1>Welcome to EventEase</h1>
            <div className="home-features">
              <div className="feature-card">
                <div className="feature-icon">📋</div>
                <h3>Centralized Event Management</h3>
                <p>A centralized platform for event management.</p>
                <button onClick={() => setActiveTab('events')} className="feature-button">Manage Events</button>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔄</div>
                <h3>Real-Time Collaboration</h3>
                <p>Real-time collaboration and updates.</p>
                <button onClick={() => setActiveTab('collaborate')} className="feature-button">Collaborate Now</button>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">⏰</div>
                <h3>Automated Scheduling</h3>
                <p>Automated scheduling and reminders.</p>
                <button onClick={() => setActiveTab('calendar')} className="feature-button">View Calendar</button>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🎟️</div>
                <h3>Integrated Ticketing</h3>
                <p>Integrated ticketing, RSVP, and guest tracking.</p>
                <button onClick={() => setActiveTab('guests')} className="feature-button">Manage Guests</button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Navbar onNavChange={setActiveTab} />
      <main className="content-area">
        {renderContent()}
      </main>
      <footer className="app-footer">
        <p>© 2025 EventEase - Simplifying Event Management</p>
      </footer>
    </div>
  );
}

export default App;
