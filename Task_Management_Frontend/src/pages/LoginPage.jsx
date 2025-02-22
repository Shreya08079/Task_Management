import React from "react";
import { Link } from "react-router";

const LoginPage = ({ afterLogin }) => {
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value,
        }),
      });
  
      // Log response to check if it's valid JSON
      const textResponse = await response.text();
      console.log("Raw Response:", textResponse);
  
      try {
        const respObj = JSON.parse(textResponse);  // Try parsing JSON
        console.log("Login Response:", respObj);
        
        if (respObj.status === "success" && respObj.user) {
          afterLogin(respObj);
        } else {
          alert(respObj.message || "Login failed");
        }
      } catch (error) {
        console.error("Invalid JSON response:", textResponse);
        alert("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  
  
  return (
    <>
  <form className="login-form" onSubmit={handleLogin}>
  <h1>Welcome Back!!!!!!!!!</h1>
  
  <label className="login-label" htmlFor="email">Email:</label>
  <input
    className="login-input"
    type="email"
    id="email"
    name="email"
    placeholder="Email"
    required
  />

  <label className="login-label" htmlFor="password">Password:</label>
  <input
    className="login-input"
    type="password"
    id="password"
    name="password"
    placeholder="Password"
    required
  />

  <button className="login-button">Login</button>
  
  <div className="signup-link">
    Don't have an Account? <Link to="/signup">SignUp</Link>
  </div>
</form>
    </>
  );
};

export default LoginPage;
