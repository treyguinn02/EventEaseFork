import { useState } from 'react';
import './styles.css';

const GuestManagement = ({ guests, onAddGuest, onDeleteGuest, onUpdateGuestStatus }) => {
  // Modal state remains local as it's UI-specific
  const [showModal, setShowModal] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    status: 'pending'
  });
  
  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGuest({
      ...newGuest,
      [name]: value
    });
  };
  
  // Add a new guest using the callback from props
  const addGuest = () => {
    if (newGuest.name.trim() === '' || newGuest.email.trim() === '') {
      alert('Please fill in all fields');
      return;
    }
    
    // Call the function passed from App component
    onAddGuest(newGuest);
    
    // Reset form and close modal
    setNewGuest({ name: '', email: '', status: 'pending' });
    setShowModal(false);
  };
  
  // Update guest status
  const handleStatusChange = (id, newStatus) => {
    onUpdateGuestStatus(id, newStatus);
  };

  return (
    <div className="guest-management">
      <header className="guest-header">
        <h2>Guest Management</h2>
        <button className="add-guest-btn" onClick={() => setShowModal(true)}>
          Add Guest
        </button>
      </header>

      {/* Guest Modal */}
      {showModal && (
        <div className="guest-modal-overlay">
          <div className="guest-modal">
            <h3>Add New Guest</h3>
            <div className="form-group">
              <label>Name:</label>
              <input 
                type="text" 
                name="name" 
                value={newGuest.name}
                onChange={handleInputChange}
                placeholder="Guest name"
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                name="email" 
                value={newGuest.email}
                onChange={handleInputChange}
                placeholder="Guest email"
              />
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select 
                name="status" 
                value={newGuest.status}
                onChange={handleInputChange}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={addGuest} className="save-btn">Add Guest</button>
              <button onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="guest-stats">
        <div className="stat-box">
          <h3>Total Guests</h3>
          <p>{guests.length}</p>
        </div>
        <div className="stat-box">
          <h3>Confirmed</h3>
          <p>{guests.filter(g => g.status === 'confirmed').length}</p>
        </div>
        <div className="stat-box">
          <h3>Pending</h3>
          <p>{guests.filter(g => g.status === 'pending').length}</p>
        </div>
        <div className="stat-box">
          <h3>Declined</h3>
          <p>{guests.filter(g => g.status === 'declined').length}</p>
        </div>
      </div>

      <div className="guest-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>          <tbody>
            {guests.map(guest => (
              <tr key={guest.id} className={`guest-row status-${guest.status}`}>
                <td>{guest.name}</td>
                <td>{guest.email}</td>
                <td>
                  <select
                    value={guest.status}
                    onChange={(e) => handleStatusChange(guest.id, e.target.value)}
                    className={`status-select ${guest.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="declined">Declined</option>
                  </select>
                </td>
                <td>
                  <button className="delete-btn" onClick={() => onDeleteGuest(guest.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestManagement;