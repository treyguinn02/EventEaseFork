import './styles.css';

const Home = ({ setActiveTab }) => {
  // Function to handle navigation when a feature is clicked
  const handleFeatureClick = (tabName) => {
    if (setActiveTab) {
      setActiveTab(tabName);
    }
  };

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Welcome to EventEase</h1>
        <p>Your all-in-one solution for event planning and management</p>
      </div>
        <div className="home-features">
        <div className="feature-card">
          <span className="feature-emoji">📅</span>
          <button 
            className="feature-button-heading" 
            onClick={() => handleFeatureClick('Calendar')}
          >
            Calendar
          </button>
          <p>Plan and visualize your events with our intuitive calendar interface</p>
        </div>
        
        <div className="feature-card">
          <span className="feature-emoji">✓</span>
          <button 
            className="feature-button-heading" 
            onClick={() => handleFeatureClick('Tasks')}
          >
            Tasks
          </button>
          <p>Keep track of all your event tasks and deadlines in one place</p>
        </div>
        
        <div className="feature-card">
          <span className="feature-emoji">👥</span>
          <button 
            className="feature-button-heading" 
            onClick={() => handleFeatureClick('Collaboration')}
          >
            Collaboration
          </button>
          <p>Work together with your team in real-time</p>
        </div>
        
        <div className="feature-card">
          <span className="feature-emoji">🎭</span>
          <button 
            className="feature-button-heading" 
            onClick={() => handleFeatureClick('Guests')}
          >
            Guest Management
          </button>
          <p>Manage invitations, RSVPs, and guest information effortlessly</p>
        </div>
        
        <div className="feature-card">
          <span className="feature-emoji">📚</span>
          <button 
            className="feature-button-heading" 
            onClick={() => handleFeatureClick('Documentation')}
          >
            Documentation
          </button>
          <p>Access guides, tutorials, and support information for EventEase</p>
        </div>
      </div>
    </div>
  );
};

export default Home;