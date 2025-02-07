import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "../styles/checkout.module.css"; // Create a CSS file for styling if needed

function CheckoutSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/shop"); // Redirect to home page
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [navigate]);

  return (
    <div className={styles.successContainer}>
      <h1>Checkout Successful</h1>
      <p>
        Thank you for your purchase! Your order has been processed successfully.
      </p>
      <CircularProgress /> {/* Loading spinner */}
    </div>
  );
}

export default CheckoutSuccess;
