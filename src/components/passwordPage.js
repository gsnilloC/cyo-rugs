import React from "react";
import styles from "../styles/passwordPage.module.css";
import logoImage from "../assets/images/logo.JPG";
import usePassword from "../hooks/usePassword";

const PasswordPage = () => {
  const { password, setPassword, handleSubmit } = usePassword();

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
