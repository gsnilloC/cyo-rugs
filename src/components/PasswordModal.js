import React, { useState } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../styles/passwordModal.module.css";

const PasswordModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "yourPassword") {
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
          <h2>Under Construction</h2>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
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
