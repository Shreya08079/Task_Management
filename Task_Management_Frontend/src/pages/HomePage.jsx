import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./HomePage.css";

const HomePage = ({ currUser, handleLogout }) => {
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setShowPopup(true);
      setEmail('');
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  };

  return (
    <div className="home-container">
      <Navbar currUser={currUser} handleLogout={handleLogout} />
      
      <section className="hero-section">
        <h1>Welcome, {currUser?.name || 'Guest'}!</h1>
        <p>Discover, Create, and Share Amazing Content</p>
      </section>

      <section className="subscribe-section">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Stay updated with our latest news and updates</p>
        <form onSubmit={handleSubscribe} className="subscribe-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="subscribe-button">
            <span>Subscribe</span>
          </button>
        </form>
      </section>

      {showPopup && (
        <div className="popup">
          <p>Successfully subscribed! Thank you!</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;