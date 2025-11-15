import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // <-- UPDATED: Imports api.js

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // This will show errors
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous errors

    try {
      // UPDATED: Uses 'api' and a relative path
      const res = await api.post("/api/users/token/", {
        username,
        password,
      });
      
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh", res.data.refresh); // Kept this from your file
      navigate("/home");

    } catch (err) {
      // UPDATED: Better error handling
      console.error("Login error", err);
      if (err.response && err.response.data.detail) {
        setMessage(`❌ ${err.response.data.detail}`);
      } else {
        setMessage("❌ Login failed. Please check your credentials.");
      }
    }
  };

  // Kept all your styles from the second file
  const buttonStyle = {
    backgroundColor: "#e63946",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "10px 0",
    width: "100%",
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  const buttonHover = {
    transform: "scale(1.05)",
    boxShadow: "0px 0px 15px #e63946",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "url('https://images2.alphacoders.com/135/thumb-1920-1356617.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "rgba(0,0,0,0.75)",
          padding: "40px",
          borderRadius: "12px",
          color: "white",
          width: "320px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "none",
            boxSizing: "border-box" // Added for better padding behavior
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "none",
            boxSizing: "border-box" // Added for better padding behavior
          }}
        />
        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, buttonHover)
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, buttonStyle)
          }
        >
          Login
        </button>

        {message && (
          // UPDATED: Style for the error message
          <p style={{ color: "#ff4655", marginTop: "10px", fontWeight: "bold" }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: "10px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#e63946", fontWeight: "bold" }}>
            Register
          </Link>
        </p>
        <p style={{ marginTop: "5px" }}>
          <Link to="/" style={{ color: "#f1faee" }}>
            Return to Home
          </Link>
        </p>
      </form>
    </div>
  );
}