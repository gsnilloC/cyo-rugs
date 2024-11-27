import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../styles/loginModal.module.css";

const LoginModal = ({ isOpen, onClose }) => {
  const [Secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Secret === "lookBOWHELLO") {
      navigate("/list");
      onClose();
    } else {
      setError("Incorrect Secret");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Admin Login</h2>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="Secret"
            value={Secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter Password"
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
