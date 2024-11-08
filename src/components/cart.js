import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/cart.module.css";
import useCart from "../hooks/useCart";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    total,
    handleIncrease,
    handleDecrease,
    handleCheckout,
  } = useCart();

  const [loading, setLoading] = useState(false);

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
          bgcolor="rgba(255, 255, 255, 0.8)"
          zIndex="9999"
        >
          <CircularProgress size={100} />
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
                  src={item.imageUrls[0]}
                  alt={item.name}
                  className={styles.cartItemImage}
                />
                <div className={styles.cartItemInfo}>
                  <p className={styles.cartItemName}>
                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                  </p>
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
          <p className={styles.cartTotal}>Subtotal ${total.toFixed(2)}</p>
          <p className={styles.shippingMessage}>Shipping to be calculated</p>
          <button
            className={styles.checkoutButton}
            onClick={() => handleCheckout(cartItems, setLoading)}
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
