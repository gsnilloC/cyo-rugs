import React from "react";
import styles from "../styles/Cart.module.css";

function Cart() {
  const cartItems = [
    {
      id: 1,
      name: "Phantom Troupe",
      image: require("../assets/images/phantom.JPG"),
      price: 299.99,
      quantity: 1,
    },
    {
      id: 2,
      name: "Off-White",
      image: require("../assets/images/off-white.JPG"),
      price: 199.99,
      quantity: 2,
    },
  ];

  const removeFromCart = (itemId) => {
    console.log(`Removed item with id ${itemId} from cart`);
  };

  const updateQuantity = (itemId, change) => {
    console.log(`Updated quantity for item ${itemId} by ${change}`);
  };

  const checkout = () => {
    console.log("Proceeding to checkout");
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className={styles.cartContainer}>
      <h1>Your Shopping Cart</h1>
      {cartItems.map((item) => (
        <div key={item.id} className={styles.cartItem}>
          <img
            src={item.image}
            alt={item.name}
            className={styles.cartItemImage}
          />
          <div className={styles.cartItemInfo}>
            <h2 className={styles.cartItemName}>{item.name}</h2>
            <p className={styles.cartItemPrice}>${item.price.toFixed(2)}</p>
          </div>
          <div className={styles.quantityControl}>
            <button
              className={styles.quantityButton}
              onClick={() => updateQuantity(item.id, -1)}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              className={styles.quantityButton}
              onClick={() => updateQuantity(item.id, 1)}
            >
              +
            </button>
          </div>
          <button
            className={styles.removeButton}
            onClick={() => removeFromCart(item.id)}
          >
            Remove
          </button>
        </div>
      ))}
      <p className={styles.cartTotal}>Total: ${total.toFixed(2)}</p>
      <button className={styles.checkoutButton} onClick={checkout}>
        Proceed to Checkout
      </button>
    </div>
  );
}

export default Cart;
