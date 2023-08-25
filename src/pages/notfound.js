import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/Navbar";
const NotFound = () => {
  return (
    <div>
      <NavBar />
      <div style={styles.container}>
        <h1 style={styles.title}>404 - Page Not Found</h1>
        <p style={styles.message}>
          The page you are looking for does not exist.
        </p>
        <Link to="/" style={styles.button}>
          Go to Home
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
  },
  title: {
    fontSize: "36px",
    marginBottom: "20px",
  },
  message: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  button: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "5px",
    textDecoration: "none",
    fontSize: "18px",
  },
};

export default NotFound;
