// import React, { useState } from "react";
// import Navbar from "../components/Navbar";
// import "./HomePage.css";

// const HomePage = ({ currUser, handleLogout }) => {
//   const [email, setEmail] = useState('');
//   const [showPopup, setShowPopup] = useState(false);

//   const handleSubscribe = (e) => {
//     e.preventDefault();
//     if (email) {
//       setShowPopup(true);
//       setEmail('');
//       setTimeout(() => {
//         setShowPopup(false);
//       }, 3000);
//     }
//   };

//   return (
//     <div className="home-container">
//       <Navbar currUser={currUser} handleLogout={handleLogout} />
      
//       <section className="hero-section">
//         <h1>Welcome, {currUser?.name || 'Guest'}!</h1>
//         <p>Discover, Create, and Share Amazing Content</p>
//       </section>

//       <section className="subscribe-section">
//         <h2>Subscribe to Our Newsletter</h2>
//         <p>Stay updated with our latest news and updates</p>
//         <form onSubmit={handleSubscribe} className="subscribe-form">
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <button type="submit" className="subscribe-button">
//             <span>Subscribe</span>
//           </button>
//         </form>
//       </section>

//       {showPopup && (
//         <div className="popup">
//           <p>Successfully subscribed! Thank you!</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomePage;

// HomePage.jsx
// HomePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./HomePage.css";

const HomePage = ({ currUser, handleLogout }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const scrollProgressRef = useRef(null);

  const features = [
    {
      icon: "🚀",
      title: "Smart Task Management",
      description: "Organize and prioritize your tasks efficiently"
    },
    {
      icon: "⚡",
      title: "Real-time Updates",
      description: "Stay synchronized with your team"
    },
    {
      icon: "🎯",
      title: "Goal Tracking",
      description: "Monitor your progress effectively"
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Visualize your productivity trends"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setShowPopup(true);
      setEmail("");
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  };

  const handleGetStarted = () => {
    navigate('/tasks');
  };

  return (
    <div className="home-container">
      <div className="scroll-progress" ref={scrollProgressRef}></div>
      <Navbar currUser={currUser} handleLogout={handleLogout} />

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="animated-text">
            Welcome to TaskFlow, {currUser?.fullName || "Guest"}!
          </h1>
          <p className="hero-subtitle">
            Streamline Your Workflow, Amplify Your Productivity
          </p>
          <div className="cta-buttons">
            <button className="primary-btn" onClick={handleGetStarted}>
              Get Started →
            </button>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose TaskFlow?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${index === activeFeature ? "active" : ""}`}
                onClick={handleGetStarted}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="subscribe-section">
        <div className="subscribe-content">
          <h2 className="section-title">Stay Connected</h2>
          <p>Join our newsletter for the latest updates and tips</p>
          <form onSubmit={handleSubscribe} className="subscribe-form">
            <div className="input-group">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="subscribe-button">
              <span>Subscribe Now</span>
            </button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-waves">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
          <div className="wave wave4"></div>
        </div>
        <div className="footer-content">
          <div className="footer-logo">
            <h3>TaskFlow</h3>
            <p>Simplify your workflow</p>
          </div>
          <div className="footer-decoration">
            <div className="footer-circles">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </footer>

      {showPopup && (
        <div className="popup">
          <span className="popup-icon">✓</span>
          <p>Successfully subscribed! Thank you!</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;