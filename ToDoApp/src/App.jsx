import React from 'react';
import './App.css';
import Card from './Card';
import TriniImage from './assets/Trini.jpg';
import ArepaImage from './assets/Arepa.jpg';
import NYEatsImage from './assets/NewYorkGrill.jpg';
import StrandDCImage from './assets/StrandDc.jpg';
import CoastalTacosImage from './assets/CoastalTaco.jpg';
import TastemakerImage from './assets/MarylandAvenue.jpg';
import FarEastFusionImage from './assets/FarEastTaco.jpg';
import SwisslerFactoryImage from './assets/Swissler.jpg';
import SmokinBBQImage from './assets/BBQ.jpg';
import JerkAtNiteImage from './assets/JerkAtNite.jpg';

function App() {
  const foodTrucks = [
    {
      name: "Maryland Avenue Food Truck",
      image: TastemakerImage,
      description: "Authentic birria tacos with consommé for dipping. Known for their crispy quesabirria and rich, flavorful meat.",
      location: "Maryland Avenue • Mon-Fri, 11am-3pm"
    },
    {
      name: "Arepa Zone",
      image: ArepaImage,
      description: "Middle Eastern specialties including fresh shawarma wraps, falafel, and homemade hummus with fresh pita.",
      location: "Arlington, VA • Tue-Sun, 10am-8pm"
    },
    {
      name: "New York Eats",
      image: NYEatsImage,
      description: "American Food with a twist of Modernity, bringing Cross State Culture under a single menu.",
      location: "University Mall • Wed-Sun, 12pm-9pm"
    },
    {
      name: "Trini Vybz",
      image: TriniImage,
      description: "Carribean Fusion Street Food with an Asian Twist. Try their famous Jerk Chicken Tacos, and Rice Bowls.",
      location: " • Thu-Mon, 4pm-10pm"
    },
    {
      name: "Coastal Tacos",
      image: CoastalTacosImage,
      description: "Fresh seafood tacos with house-made salsas and slaws. Try their famous grilled shrimp tacos with mango salsa.",
      location: "Burke WaterFront Park • Daily, 11am-7pm"
    },
    {
      name: "Tastemaker",
      image: StrandDCImage,
      description: "Indian Fusion street food with a modern twist. Featuring tikka masala burritos, deconstructed samosas, and naan wraps.",
      location: "Financial District • Mon-Fri, 11am-2pm"
    },
    {
      name: "Far East Fusion",
      image: FarEastFusionImage,
      description: "Well Know Mexican Street Food including Tacos, Burritos, Quesadillas, Tortas, Tostadas, and more.",
      location: "Farragut Square • Daily, 11am-8pm" // Added missing location
    },
    {
      name: "Swissler Factory",
      image: SwisslerFactoryImage,
      description: "Do you guys like Cheese, Well this is the place to be for fresh Cheese Patties and More.",
      location: "Union Market • Tue-Sat, 11am-3pm"
    },
    {
      name: "Smokin' BBQ",
      image: SmokinBBQImage,
      description: "Slow-smoked meats including brisket, pulled pork, and ribs with classic southern sides and homemade BBQ sauces.",
      location: "Union Market • Wed-Sun, 12pm-8pm"
    },
    {
      name: "Jerk At Nite",
      image: JerkAtNiteImage,
      description: "No One cooks like a carribean, Join us for Oxtails and Jerk Chicken.",
      location: "H Street Northeast, 20002 • Daily, 10am-6pm"
    }
  ];

  return (
    <div className="App">
      <h1>Food Truck Favorites</h1>
      <div className="container">
        {foodTrucks.map((truck, index) => (
          <Card 
            key={index}
            name={truck.name}
            image={truck.image}
            description={truck.description}
            location={truck.location}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
