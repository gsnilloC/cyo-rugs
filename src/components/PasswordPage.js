import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Change this line
import styles from "../styles/PasswordPage.module.css"; // Create a CSS file for styling
import logoImage from "../assets/images/logo.JPG"; // Adjust the path as necessary

const PasswordPage = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const correctPassword = "lookBOWHELLO";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      navigate("/home");
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img src={logoImage} alt="Logo" className={styles.logo} />
      </div>
      <h1>Under Construction 🚧</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PasswordPage;
