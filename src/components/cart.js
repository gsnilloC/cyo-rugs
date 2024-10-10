import React, { useState } from "react";
import styles from "../styles/cart.module.css";
import useCart from "../hooks/useCart"; // Import the new useCart hook
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const handleCheckout = async (cartItems, setLoading) => {
  try {
    setLoading(true); // Set loading to true
    const response = await axios.post("/api/checkout", { cartItems }); // Send cartItems to the backend
    const { checkoutLink } = response.data;

    if (checkoutLink) {
      setTimeout(() => {
        window.location.href = checkoutLink; // Redirect the user to the Square checkout page
      }, 3000); // Delay of 3 seconds
    }

    // Clear cart from local storage after payment
    localStorage.removeItem("cartItems");
  } catch (error) {
    console.error("Error during checkout:", error);
    alert("Failed to initiate checkout. Please try again.");
  } finally {
    setTimeout(() => {
      setLoading(false); // Set loading to false after the process
    }, 3500); // Loading animation for 3.5 seconds
  }
};

function Cart() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    total,
    handleIncrease,
    handleDecrease,
  } = useCart();

  const [loading, setLoading] = useState(false); // State to manage loading

  return (
    <div className={styles.cartContainer}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          width="100vw"
          position="fixed"
          top="0"
          left="0"
          bgcolor="rgba(255, 255, 255, 0.8)" // Optional background color
          zIndex="9999"
        >
          <CircularProgress size={100} /> {/* Large spinner */}
        </Box>
      ) : (
        <>
          <h1>Your Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img
                  src={item.imageUrls[0]} // Get the first image URL
                  alt={item.name}
                  className={styles.cartItemImage}
                />
                <div className={styles.cartItemInfo}>
                  <h2 className={styles.cartItemName}>{item.name}</h2>
                  <p className={styles.cartItemPrice}>
                    ${item.price.toFixed(2)}
                  </p>
                  <div className={styles.quantityControl}>
                    <button
                      className={styles.quantityButton}
                      onClick={() => handleDecrease(item.id)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className={styles.quantityButton}
                      onClick={() => handleIncrease(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
          <p className={styles.shippingMessage}>Shipping to be calculated</p>
          <p className={styles.cartTotal}>Total: ${total.toFixed(2)}</p>
          <button
            className={styles.checkoutButton}
            onClick={() => handleCheckout(cartItems, setLoading)} // Checkout button now properly passes cartItems
          >
            Checkout
          </button>
          <button className={styles.checkoutButton} onClick={clearCart}>
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
