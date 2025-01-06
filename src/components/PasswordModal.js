import React, { useState } from "react";
import styles from "../styles/passwordModal.module.css";
import logo from "../assets/images/logo.JPG";

const PasswordModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "lookBOWHELLO") {
      onClose();
    } else {
      setError("Incorrect Password");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <img src={logo} alt="CYO Rugs Logo" className={styles.logo} />
          <h2>Under Construction 🚧</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className={styles.input}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
