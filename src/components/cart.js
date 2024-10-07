import React from "react";
import styles from "../styles/cart.module.css";
import { useCart } from "./cartContext"; // Import the useCart hook

function Cart() {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleIncrease = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    updateQuantity(itemId, item.quantity + 1);
  };

  const handleDecrease = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    }
  };

  return (
    <div className={styles.cartContainer}>
      <h1>Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <img
              src={item.image}
              alt={item.name}
              className={styles.cartItemImage}
            />
            <div className={styles.cartItemInfo}>
              <h2 className={styles.cartItemName}>{item.name}</h2>
              <p className={styles.cartItemPrice}>${item.price.toFixed(2)}</p>
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
      <p className={styles.shippingMessage}>Shipping to be calculated</p>{" "}
      {/* New shipping message */}
      <p className={styles.cartTotal}>Total: ${total.toFixed(2)}</p>
      <button className={styles.checkoutButton} onClick={clearCart}>
        Clear Cart
      </button>
    </div>
  );
}

export default Cart;
