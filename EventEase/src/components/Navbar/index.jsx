import { useState } from 'react';
import './styles.css';

const Navbar = ({ onNavChange }) => {
  const [activeTab, setActiveTab] = useState('home');

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (onNavChange) {
      onNavChange(tab);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">EventEase</div>
      <ul className="nav-links">
        <li 
          className={activeTab === 'home' ? 'active' : ''} 
          onClick={() => handleNavClick('home')}
        >
          <a href="#home">Home</a>
        </li>
        <li 
          className={activeTab === 'events' ? 'active' : ''} 
          onClick={() => handleNavClick('events')}
        >
          <a href="#events">Events</a>
        </li>
        <li 
          className={activeTab === 'calendar' ? 'active' : ''} 
          onClick={() => handleNavClick('calendar')}
        >
          <a href="#calendar">Calendar</a>
        </li>
        <li 
          className={activeTab === 'guests' ? 'active' : ''} 
          onClick={() => handleNavClick('guests')}
        >
          <a href="#guests">Guests</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;