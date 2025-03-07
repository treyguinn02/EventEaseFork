import { useState } from 'react';
import './styles.css';

const GuestManagement = () => {
  const [guests, setGuests] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'confirmed'
    }
  ]);

  return (
    <div className="guest-management">
      <header className="guest-header">
        <h2>Guest Management</h2>
        <button className="add-guest-btn">
          Add Guest
        </button>
      </header>

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
          </thead>
          <tbody>
            {guests.map(guest => (
              <tr key={guest.id}>
                <td>{guest.name}</td>
                <td>{guest.email}</td>
                <td>{guest.status}</td>
                <td>
                  <button className="delete-btn">Delete</button>
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