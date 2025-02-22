import React from 'react';
import { Link } from 'react-router';
import './Navbar.css';

const Navbar = ({ currUser, handleLogout }) => {
  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <div className='navbar-brand'>
          <Link to="/" className='logo'>
            TaskManager
          </Link>
        </div>
        
        <div className='navbar-links'>
          <Link to="/" className='nav-link'>Home</Link>
          <Link to="/tasks" className='nav-link'>Tasks</Link>
          
          {!currUser ? (
            <>
              <Link to="/login" className='nav-link'>Login</Link>
              <Link to="/signup" className='nav-link'>SignUp</Link>
            </>
          ) : (
            <div className='user-section'>
              <span className='user-greeting'>
                <i className='fas fa-user'></i> {/* You can add Font Awesome icons */}
                Hello, {currUser.fullName}
              </span>
              <button onClick={handleLogout} className='logout-btn'>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;