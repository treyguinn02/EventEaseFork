import './styles.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Welcome to EventEase</h1>
        <p>Your all-in-one solution for event planning and management</p>
      </div>
      
      <div className="home-features">
        <div className="feature-card">
          <span className="feature-emoji">📅</span>
          <h3>Calendar</h3>
          <p>Plan and visualize your events with our intuitive calendar interface</p>
        </div>
        
        <div className="feature-card">
          <span className="feature-emoji">✓</span>
          <h3>Tasks</h3>
          <p>Keep track of all your event tasks and deadlines in one place</p>
        </div>
        
        <div className="feature-card">
          <span className="feature-emoji">👥</span>
          <h3>Collaboration</h3>
          <p>Work together with your team in real-time</p>
        </div>
        
        <div className="feature-card">
          <span className="feature-emoji">🎭</span>
          <h3>Guest Management</h3>
          <p>Manage invitations, RSVPs, and guest information effortlessly</p>
        </div>
      </div>
      
      <div className="home-cta">
        <h2>Ready to get started?</h2>
        <p>Select a project from the navigation bar or create a new one to begin planning your event.</p>
        <a href="#" className="get-started-btn">Get Started</a>
      </div>
    </div>
  );
};

export default Home;