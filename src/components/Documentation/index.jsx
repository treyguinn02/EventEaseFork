import './styles.css';

const Documentation = () => {
  return (
    <div className="documentation-container">
      <div className="documentation-header">
        <h1>Documentation & Support</h1>
        <p>Find answers to common questions and learn how to make the most of EventEase</p>
      </div>

      <div className="documentation-section">
        <h2>Getting Started</h2>
        <div className="doc-card">
          <h3>Creating Your First Project</h3>
          <p>To create a new event project, navigate to the Calendar tab and click on "New Project". Fill in the event details and save to get started.</p>
        </div>
        <div className="doc-card">
          <h3>Adding Tasks</h3>
          <p>Manage your event planning by creating tasks in the Tasks tab. You can assign deadlines, priorities, and team members to each task.</p>
        </div>
      </div>

      <div className="documentation-section">
        <h2>Feature Guides</h2>
        <div className="doc-card">
          <h3>Calendar Management</h3>
          <p>The Calendar view allows you to visualize your event timeline. You can drag and drop events, set reminders, and share your calendar with team members.</p>
        </div>
        <div className="doc-card">
          <h3>Guest Management</h3>
          <p>Keep track of invitations, RSVPs, and guest information in the Guest Management section. Import guest lists, send reminders, and manage seating arrangements.</p>
        </div>
        <div className="doc-card">
          <h3>Collaboration Tools</h3>
          <p>Work together with your team in real-time using our collaboration features. Share documents, assign responsibilities, and communicate within the platform.</p>
        </div>
      </div>

      <div className="documentation-section">
        <h2>FAQ</h2>
        <div className="faq-item">
          <h3>How do I share my event with others?</h3>
          <p>Go to the Collaboration tab and click "Share". Enter email addresses of people you want to invite and select their permission level.</p>
        </div>
        <div className="faq-item">
          <h3>Can I export my event details?</h3>
          <p>Yes! You can export your event calendar, guest list, and task list by clicking the "Export" button in each respective section.</p>
        </div>
        <div className="faq-item">
          <h3>How do I contact support?</h3>
          <p>If you need additional help, please email us at <a href="mailto:support@eventease.com">support@eventease.com</a> or use the chat button in the bottom right corner.</p>
        </div>
      </div>

      <div className="support-contact">
        <h2>Need More Help?</h2>
        <p>Our support team is available Monday through Friday, 9am-5pm ET.</p>
        <div className="contact-buttons">
          <button className="contact-btn email">Email Support</button>
          <button className="contact-btn chat">Live Chat</button>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
