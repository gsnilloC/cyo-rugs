import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../styles/loginModal.module.css";

const LoginModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "lookBOWHELLO") {
      navigate("/list");
      onClose();
    } else {
      setError("Incorrect password");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Password</h2>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className={styles.input}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
