import { useState } from 'react';
import './styles.css';

const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Technical Support',
    message: '',
    priority: 'medium'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Toggle FAQ answers
  const toggleFAQ = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };
  
  // Filter documentation content based on search query
  const filterContent = (text) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Support request submitted:', formData);
    // Here you would typically send the data to your backend API
    // For demonstration purposes, we'll just show a success message
    setFormSubmitted(true);
    
    // Reset form after 5 seconds and hide it
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: 'Technical Support',
        message: '',
        priority: 'medium'
      });
      setFormSubmitted(false);
      setShowContactForm(false);
    }, 5000);
  };

  return (
    <div className="documentation-container">
      <div className="documentation-header">
        <h1>Documentation & Support</h1>
        <p>Find answers to common questions and learn how to make the most of EventEase</p>
        
        {/* Search Bar */}
        <div className="search-container">
          <input 
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Table of Contents */}
      <div className="table-of-contents">
        <h2>Quick Navigation</h2>
        <ul>
          <li><a href="#getting-started">Getting Started</a></li>
          <li><a href="#feature-guides">Feature Guides</a></li>
          <li><a href="#tutorials">Tutorials & Walkthroughs</a></li>
          <li><a href="#best-practices">Best Practices</a></li>
          <li><a href="#integrations">Integrations</a></li>
          <li><a href="#faq">Frequently Asked Questions</a></li>
          <li><a href="#troubleshooting">Troubleshooting</a></li>
          <li><a href="#support">Support Options</a></li>
        </ul>
      </div>

      <div id="getting-started" className="documentation-section">
        <h2>Getting Started</h2>
        <div className="doc-card">
          <h3>Creating Your First Project</h3>
          <p>To create a new event project, navigate to the Calendar tab and click on "New Project". Fill in the event details and save to get started.</p>
          <div className="steps-container">
            <h4>Step-by-step guide:</h4>
            <ol>
              <li>Log in to your EventEase account</li>
              <li>Click on the "Calendar" tab in the main navigation</li>
              <li>Select "New Project" from the top-right menu</li>
              <li>Enter your event name, date, time, and location</li>
              <li>Add a description and any special requirements</li>
              <li>Click "Create" to save your new event</li>
            </ol>
          </div>
          <div className="tip-box">
            <strong>Pro Tip:</strong> Use templates for common event types like "Corporate Conference" or "Wedding" to save time setting up your project.
          </div>
        </div>
        
        <div className="doc-card">
          <h3>Adding Tasks</h3>
          <p>Manage your event planning by creating tasks in the Tasks tab. You can assign deadlines, priorities, and team members to each task.</p>
          <div className="steps-container">
            <h4>Creating effective tasks:</h4>
            <ol>
              <li>Navigate to the "Tasks" tab</li>
              <li>Click "Add New Task" button</li>
              <li>Enter a clear, descriptive task name</li>
              <li>Set a deadline that allows enough buffer time</li>
              <li>Assign a priority level (Low, Medium, High, Urgent)</li>
              <li>Assign team members responsible for completion</li>
              <li>Add any necessary attachments or references</li>
            </ol>
          </div>
        </div>
        
        <div className="doc-card">
          <h3>Setting Up Your Team</h3>
          <p>Invite team members and collaborate effectively by configuring user permissions and roles.</p>
          <div className="permissions-table">
            <h4>Available permission levels:</h4>
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Capabilities</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Owner</td>
                  <td>Full access to all features and settings</td>
                  <td>Primary event planner</td>
                </tr>
                <tr>
                  <td>Admin</td>
                  <td>Can modify all event details and invite others</td>
                  <td>Co-planners and managers</td>
                </tr>
                <tr>
                  <td>Member</td>
                  <td>Can view all details and update assigned tasks</td>
                  <td>Team members working on specific aspects</td>
                </tr>
                <tr>
                  <td>Viewer</td>
                  <td>Read-only access to event details</td>
                  <td>Stakeholders who need to stay informed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="feature-guides" className="documentation-section">
        <h2>Feature Guides</h2>
        <div className="doc-card">
          <h3>Calendar Management</h3>
          <p>The Calendar view allows you to visualize your event timeline. You can drag and drop events, set reminders, and share your calendar with team members.</p>
          <div className="feature-highlights">
            <h4>Key calendar features:</h4>
            <ul>
              <li><strong>Multiple views</strong> - Toggle between day, week, month, and timeline views</li>
              <li><strong>Drag and drop</strong> - Easily reschedule events by dragging them to new dates</li>
              <li><strong>Color coding</strong> - Assign colors to different event types for quick recognition</li>
              <li><strong>Recurring events</strong> - Set up regular planning meetings or check-ins</li>
              <li><strong>Export options</strong> - Sync with Google Calendar, Outlook, or export as PDF</li>
            </ul>
          </div>
        </div>
        
        <div className="doc-card">
          <h3>Guest Management</h3>
          <p>Keep track of invitations, RSVPs, and guest information in the Guest Management section. Import guest lists, send reminders, and manage seating arrangements.</p>
          <div className="feature-highlights">
            <h4>Guest management capabilities:</h4>
            <ul>
              <li><strong>Bulk import</strong> - Add guests from CSV, Excel, or Google Contacts</li>
              <li><strong>Custom RSVP forms</strong> - Collect dietary preferences, plus-ones, and special requests</li>
              <li><strong>Automated reminders</strong> - Schedule email/SMS reminders for non-respondents</li>
              <li><strong>Guest categorization</strong> - Group guests by relationship, table, or custom categories</li>
              <li><strong>Seating planner</strong> - Interactive drag-and-drop seating arrangement tool</li>
            </ul>
          </div>
        </div>
        
        <div className="doc-card">
          <h3>Collaboration Tools</h3>
          <p>Work together with your team in real-time using our collaboration features. Share documents, assign responsibilities, and communicate within the platform.</p>
          <div className="feature-highlights">
            <h4>Collaboration features:</h4>
            <ul>
              <li><strong>Real-time editing</strong> - Multiple users can update information simultaneously</li>
              <li><strong>Comment threads</strong> - Discuss specific aspects of your event planning</li>
              <li><strong>Document sharing</strong> - Upload contracts, floor plans, and other important files</li>
              <li><strong>Task assignment</strong> - Delegate responsibilities and track progress</li>
              <li><strong>Activity feed</strong> - See recent changes and updates from team members</li>
            </ul>
          </div>
        </div>
        
        <div className="doc-card">
          <h3>Budget Tracking</h3>
          <p>Keep your event finances under control with our comprehensive budget management tools.</p>
          <div className="feature-highlights">
            <h4>Budget management features:</h4>
            <ul>
              <li><strong>Budget templates</strong> - Start with industry-standard budget categories</li>
              <li><strong>Expense tracking</strong> - Log actual expenses against estimated costs</li>
              <li><strong>Payment scheduling</strong> - Track deposit due dates and payment deadlines</li>
              <li><strong>Visual reports</strong> - See spending breakdowns with interactive charts</li>
              <li><strong>Receipt storage</strong> - Upload and organize digital copies of all receipts</li>
            </ul>
          </div>
          <div className="tip-box">
            <strong>Pro Tip:</strong> Set up budget alerts to be notified when you're approaching your spending limit in any category.
          </div>
        </div>
      </div>

      <div id="tutorials" className="documentation-section">
        <h2>Tutorials & Walkthroughs</h2>
        <div className="doc-card">
          <h3>Planning a Corporate Conference</h3>
          <p>A comprehensive guide to organizing a successful business conference using EventEase.</p>
          <div className="video-tutorial">
            <img src="/tutorial-placeholder.jpg" alt="Conference Planning Tutorial" className="tutorial-thumbnail" />
            <a href="#" className="tutorial-link">Watch the video tutorial</a>
          </div>
          <div className="download-link">
            <a href="#" className="pdf-download">Download PDF guide</a>
          </div>
        </div>
        
        <div className="doc-card">
          <h3>Creating Perfect Wedding Timelines</h3>
          <p>Learn how to build a detailed wedding day timeline that keeps everything on schedule.</p>
          <div className="video-tutorial">
            <img src="/tutorial-placeholder.jpg" alt="Wedding Timeline Tutorial" className="tutorial-thumbnail" />
            <a href="#" className="tutorial-link">Watch the video tutorial</a>
          </div>
          <div className="download-link">
            <a href="#" className="pdf-download">Download PDF guide</a>
          </div>
        </div>
      </div>

      <div id="best-practices" className="documentation-section">
        <h2>Best Practices</h2>
        <div className="doc-card">
          <h3>Event Planning Timeline</h3>
          <p>Recommendations for how far in advance to complete different planning tasks.</p>
          <div className="timeline-guide">
            <div className="timeline-item">
              <div className="time-marker">12 months before</div>
              <div className="timeline-content">
                <p>Set date, book venue, create initial budget, start vendor research</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="time-marker">6 months before</div>
              <div className="timeline-content">
                <p>Finalize vendor contracts, send save-the-dates, plan detailed schedule</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="time-marker">3 months before</div>
              <div className="timeline-content">
                <p>Send invitations, confirm details with vendors, plan logistics</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="time-marker">1 month before</div>
              <div className="timeline-content">
                <p>Final guest count, seating assignments, detailed run-of-show</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="time-marker">1 week before</div>
              <div className="timeline-content">
                <p>Confirm all details, brief team members, prepare emergency kit</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="doc-card">
          <h3>Task Management Strategies</h3>
          <p>Tips for effective task delegation and progress tracking.</p>
          <div className="best-practice-list">
            <ul>
              <li><strong>Break down large tasks</strong> into manageable sub-tasks with clear deliverables</li>
              <li><strong>Assign clear ownership</strong> for each task to a specific team member</li>
              <li><strong>Set realistic deadlines</strong> with buffer time for unexpected delays</li>
              <li><strong>Schedule regular check-ins</strong> to monitor progress and address issues early</li>
              <li><strong>Document important decisions</strong> and changes in the task comments</li>
            </ul>
          </div>
        </div>
      </div>

      <div id="integrations" className="documentation-section">
        <h2>Integrations</h2>
        <div className="doc-card">
          <h3>Calendar Integrations</h3>
          <p>Sync your EventEase calendar with popular calendar applications.</p>
          <div className="integration-list">
            <div className="integration-item">
              <img src="/integrations/google-calendar.png" alt="Google Calendar" className="integration-icon" />
              <div>
                <h4>Google Calendar</h4>
                <p>Two-way sync with Google Calendar for seamless event management</p>
                <a href="#" className="integration-link">Connect Google Calendar</a>
              </div>
            </div>
            <div className="integration-item">
              <img src="/integrations/outlook.png" alt="Outlook" className="integration-icon" />
              <div>
                <h4>Microsoft Outlook</h4>
                <p>Sync your events with Outlook calendar and email</p>
                <a href="#" className="integration-link">Connect Outlook</a>
              </div>
            </div>
            <div className="integration-item">
              <img src="/integrations/apple.png" alt="Apple Calendar" className="integration-icon" />
              <div>
                <h4>Apple Calendar</h4>
                <p>Sync events with Apple Calendar on Mac and iOS devices</p>
                <a href="#" className="integration-link">Connect Apple Calendar</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="doc-card">
          <h3>Communication Integrations</h3>
          <p>Connect EventEase with your favorite communication tools.</p>
          <div className="integration-list">
            <div className="integration-item">
              <img src="/integrations/slack.png" alt="Slack" className="integration-icon" />
              <div>
                <h4>Slack</h4>
                <p>Get notifications and updates directly in your Slack channels</p>
                <a href="#" className="integration-link">Connect Slack</a>
              </div>
            </div>
            <div className="integration-item">
              <img src="/integrations/teams.png" alt="Microsoft Teams" className="integration-icon" />
              <div>
                <h4>Microsoft Teams</h4>
                <p>Integrate EventEase with your Microsoft Teams workspace</p>
                <a href="#" className="integration-link">Connect Teams</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="faq" className="documentation-section">
        <h2>FAQ</h2>
        {[
          {
            question: "How do I share my event with others?",
            answer: "Go to the Collaboration tab and click Share. Enter email addresses of people you want to invite and select their permission level. You can choose between Owner, Admin, Member, and Viewer permissions depending on how much access you want each person to have."
          },
          {
            question: "Can I export my event details?",
            answer: "Yes! You can export your event calendar, guest list, and task list by clicking the Export button in each respective section. We support exports in multiple formats including PDF, Excel, CSV, and iCal."
          },
          {
            question: "How do I contact support?",
            answer: "If you need additional help, please email us at <a href='mailto:support@eventease.com'>support@eventease.com</a> or use the chat button in the bottom right corner. Our support team is available Monday through Friday, 9am-5pm ET."
          },
          {
            question: "Is there a limit to how many events I can create?",
            answer: "The number of events you can create depends on your subscription plan. Free users can create up to 3 active events at once, while Premium and Business subscribers have unlimited events."
          },
          {
            question: "Can I customize email notifications?",
            answer: "Yes, you can fully customize which notifications you receive and how often. Go to Settings > Notifications to adjust your preferences for task reminders, RSVP alerts, and team updates."
          },
          {
            question: "How secure is my event information?",
            answer: "We take security very seriously. All data is encrypted both in transit and at rest. We use industry-standard security practices and regular audits to ensure your information remains private and secure."
          }
        ].map((item, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeSection === index ? 'active' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <h3>{item.question} <span className="faq-toggle">{activeSection === index ? '−' : '+'}</span></h3>
            {activeSection === index && (
              <div className="faq-answer" dangerouslySetInnerHTML={{__html: item.answer}} />
            )}
          </div>
        ))}
      </div>

      <div id="troubleshooting" className="documentation-section">
        <h2>Troubleshooting</h2>
        <div className="doc-card">
          <h3>Common Issues & Solutions</h3>
          <div className="troubleshooting-item">
            <h4>Calendar events not displaying correctly</h4>
            <p><strong>Symptoms:</strong> Events missing or showing in wrong time slots</p>
            <p><strong>Solution:</strong> Check your timezone settings in your account preferences. Ensure all team members are using the same timezone setting for consistent viewing.</p>
          </div>
          <div className="troubleshooting-item">
            <h4>Can't send invitations</h4>
            <p><strong>Symptoms:</strong> Error messages when sending invites or invites not being delivered</p>
            <p><strong>Solution:</strong> Verify email addresses are formatted correctly. Check your quota limits for your subscription plan. If using custom email templates, ensure they follow our formatting guidelines.</p>
          </div>
          <div className="troubleshooting-item">
            <h4>Budget calculations seem incorrect</h4>
            <p><strong>Symptoms:</strong> Totals don't match individual entries, or budget warnings appear incorrectly</p>
            <p><strong>Solution:</strong> Check for duplicate expenses, verify tax rates are entered correctly, and ensure all currencies are consistent. You may need to refresh the page to see updated calculations.</p>
          </div>
        </div>
      </div>

      <div id="support" className="support-contact">
        <h2>Need More Help?</h2>
        <p>Our support team is available Monday through Friday, 9am-5pm ET.</p>
        <div className="support-options">
          <div className="support-option">
            <h3>Email Support</h3>
            <p>Average response time: 24 hours</p>
            <a href="mailto:support@eventease.com" className="contact-btn email">Email Support</a>
          </div>
          <div className="support-option">
            <h3>Live Chat</h3>
            <p>Available during business hours</p>
            <button className="contact-btn chat">Start Chat</button>
          </div>
          <div className="support-option">
            <h3>Phone Support</h3>
            <p>Premium & Business plans only</p>
            <button className="contact-btn phone">Call Support</button>
          </div>
        </div>

        {/* Technical Support Contact Form */}
        <div className="technical-support-section">
          <h3>Technical Support</h3>
          <p>Having technical issues? Fill out the form below and our technical team will get back to you as soon as possible.</p>
          
          {!showContactForm && !formSubmitted && (
            <button 
              className="contact-btn technical" 
              onClick={() => setShowContactForm(true)}
            >
              Open Support Request Form
            </button>
          )}
          
          {showContactForm && !formSubmitted && (
            <div className="contact-form-container">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address*</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject*</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Technical Support">Technical Support</option>
                    <option value="Account Issues">Account Issues</option>
                    <option value="Billing Question">Billing Question</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low - General question</option>
                    <option value="medium">Medium - Need help but not urgent</option>
                    <option value="high">High - Significant issue affecting work</option>
                    <option value="critical">Critical - System unusable</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message*</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you were trying to accomplish."
                    rows="6"
                    required
                  ></textarea>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowContactForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Submit Support Request
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {formSubmitted && (
            <div className="form-success-message">
              <div className="success-icon">✓</div>
              <h4>Support Request Submitted!</h4>
              <p>Thank you for contacting our support team. We've received your request and will respond to your email within 24 hours.</p>
              <p>Request reference: <strong>#{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</strong></p>
            </div>
          )}
        </div>
        
        <div className="feedback-section">
          <h3>Documentation Feedback</h3>
          <p>Was this documentation helpful? Let us know how we can improve.</p>
          <div className="feedback-buttons">
            <button className="feedback-btn">👍 Helpful</button>
            <button className="feedback-btn">👎 Needs Improvement</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
