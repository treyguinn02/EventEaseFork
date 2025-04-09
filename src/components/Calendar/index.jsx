import { useState } from 'react';
import './styles.css';

const Calendar = () => {
  // Get current date info
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  // State for event form
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: today.toISOString().substr(0, 10), // Format as YYYY-MM-DD
    location: '',
    urgency: 'medium'
  });
  
  // Sample task data with dates
  const [events, setEvents] = useState([
    { 
      id: 1, 
      title: 'Team Meeting', 
      date: new Date(currentYear, currentMonth, 15), 
      urgency: 'high' 
    },
    { 
      id: 2, 
      title: 'Project Deadline', 
      date: new Date(currentYear, currentMonth, 25), 
      urgency: 'critical' 
    },
    { 
      id: 3, 
      title: 'Code Review', 
      date: new Date(currentYear, currentMonth, 10), 
      urgency: 'medium' 
    },
    { 
      id: 4, 
      title: 'Client Call', 
      date: new Date(currentYear, currentMonth, 18), 
      urgency: 'medium' 
    },
    { 
      id: 5, 
      title: 'Documentation Update', 
      date: new Date(currentYear, currentMonth, 22), 
      urgency: 'low' 
    }
  ]);
  
  // Add new event
  const handleAddEvent = (e) => {
    e.preventDefault();
    
    if (!newEvent.title.trim()) {
      alert('Please enter an event title');
      return;
    }
    
    const eventDate = new Date(newEvent.date);
    const highestId = Math.max(...events.map(event => event.id), 0);
    
    const eventToAdd = {
      id: highestId + 1,
      title: newEvent.title,
      date: eventDate,
      location: newEvent.location,
      urgency: newEvent.urgency
    };
    
    setEvents([...events, eventToAdd]);
    
    // Reset form and hide it
    setNewEvent({
      title: '',
      date: today.toISOString().substr(0, 10),
      location: '',
      urgency: 'medium'
    });
    setShowEventForm(false);
    
    // Update view to show the month of the new event
    setSelectedMonth(eventDate.getMonth());
    setSelectedYear(eventDate.getFullYear());
  };
  
  // Handle input changes for new event
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };
  
  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Navigation functions
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };
  
  // Generate days for the month
  const generateCalendarDays = () => {
    let days = [];
    
    // Get first day of the month
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Fill in empty cells before first day
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Fill in days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const isToday = today.getDate() === day && 
                      today.getMonth() === selectedMonth && 
                      today.getFullYear() === selectedYear;
      
      // Find events for this day
      const dayEvents = events.filter(event => 
        event.date.getDate() === day &&
        event.date.getMonth() === selectedMonth &&
        event.date.getFullYear() === selectedYear
      );
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${isToday ? 'today' : ''}`}
        >
          <div className="calendar-date">{day}</div>
          <div className="day-events">
            {dayEvents.map(event => (
              <div 
                key={event.id} 
                className={`calendar-event urgency-${event.urgency}`}
                title={event.title}
              >
                <span className="event-dot"></span>
                <span className="event-title">{event.title}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className="calendar-container">
      <div className="calendar-header-container">
        <h2>Task Calendar</h2>
        <button 
          className="add-event-button"
          onClick={() => setShowEventForm(true)}
        >
          Add Event
        </button>
      </div>
      
      {/* Event Form Modal */}
      {showEventForm && (
        <div className="event-form-overlay">
          <div className="event-form-modal">
            <h3>Add New Event</h3>
            <form onSubmit={handleAddEvent}>
              <div className="form-group">
                <label htmlFor="event-title">Event Name:</label>
                <input
                  id="event-title"
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="event-date">Date:</label>
                <input
                  id="event-date"
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="event-location">Location:</label>
                <input
                  id="event-location"
                  type="text"
                  name="location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                  placeholder="Enter event location"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="event-urgency">Priority:</label>
                <select
                  id="event-urgency"
                  name="urgency"
                  value={newEvent.urgency}
                  onChange={handleInputChange}
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="save-event-btn">Add Event</button>
                <button 
                  type="button" 
                  className="cancel-event-btn"
                  onClick={() => setShowEventForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="calendar-header">
        <button onClick={prevMonth} className="calendar-nav-button">
          &lt;
        </button>
        <div className="current-month">
          {monthNames[selectedMonth]} {selectedYear}
        </div>
        <button onClick={nextMonth} className="calendar-nav-button">
          &gt;
        </button>
      </div>
      
      <div className="calendar-legend">
        <h4>Task Urgency</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color urgency-critical"></span>
            <span>Critical</span>
          </div>
          <div className="legend-item">
            <span className="legend-color urgency-high"></span>
            <span>High</span>
          </div>
          <div className="legend-item">
            <span className="legend-color urgency-medium"></span>
            <span>Medium</span>
          </div>
          <div className="legend-item">
            <span className="legend-color urgency-low"></span>
            <span>Low</span>
          </div>
        </div>
      </div>
      
      <div className="calendar-weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      
      <div className="calendar-days">
        {generateCalendarDays()}
      </div>
      
      <div className="calendar-summary">
        <h4>Progress Summary</h4>
        <div className="progress-stats">
          <div className="stat-item">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{events.length}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Critical</div>
            <div className="stat-value">
              {events.filter(event => event.urgency === 'critical').length}
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">High Priority</div>
            <div className="stat-value">
              {events.filter(event => event.urgency === 'high').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;