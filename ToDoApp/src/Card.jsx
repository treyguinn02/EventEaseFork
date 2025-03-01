import React from 'react';
import './Card.css';

const Card = ({ image, name, description, location }) => {
  // Function to generate a Google Maps search URL for each food truck
  const getGoogleMapsLink = (name, location) => {
    const locationParts = location ? location.split('•')[0].trim() : '';
    const searchQuery = encodeURIComponent(`${name} food truck ${locationParts}`);
    return `https://www.google.com/maps/search/${searchQuery}`;
  };

  return (
    <div className="card"> {/* Changed from "Card" to "card" to match CSS */}
      <img src={image} alt={name} className="card-image" /> {/* Added missing class */}
      <div className="card-content">
        <h3>{name}</h3>
        {location && <h4>{location}</h4>}
        <p>{description}</p>
        <div className="card-buttons">
          <a href={getGoogleMapsLink(name, location)} target="_blank" rel="noopener noreferrer">
            <button>Find Location</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card;