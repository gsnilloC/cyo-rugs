import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/cart.module.css";
import useCart from "../hooks/useCart";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Cart() {
  const {
    cartItems,
    // clearCart,
    total,
    handleIncrease,
    handleDecrease,
    handleCheckout,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleApplyDiscount = () => {
    console.log("Attempting to apply discount code:", discountCode); // Log the discount code being applied
    if (discountCode === "CYO1OF1" && !discountApplied) {
      setDiscountApplied(true);
      setErrorMessage("");
      console.log("Discount code applied successfully."); // Log success
    } else if (discountApplied) {
      setErrorMessage("Discount code already applied.");
      console.log("Discount code already applied."); // Log already applied
    } else {
      setErrorMessage("Invalid discount code.");
      console.log("Invalid discount code entered."); // Log invalid code
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountApplied(false);
    setDiscountCode("");
    setErrorMessage("");
  };

  const discountedTotal = discountApplied ? total * 0.9 : total;

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
          <h1 className={styles.cartTitle}>Your Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cartItems.map((item) => (
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
                    <p className={styles.cartItemColor}>{item.selectedColor}</p>
                    <div className={styles.quantityControl}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleDecrease(item.id)}
                      >
                        -
                      </button>
                      <span className={styles.quantityText}>
                        {item.quantity}
                      </span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleIncrease(item.id)}
                      >
                        +
                      </button>
                    </div>
                    <p className={styles.cartItemPrice}>
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <p className={styles.cartTotal}>
                Subtotal:
                {discountApplied ? (
                  <>
                    <span className={styles.oldPrice}>${total.toFixed(2)}</span>
                    <span className={styles.newPrice}>
                      ${discountedTotal.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <>${discountedTotal.toFixed(2)}</>
                )}
              </p>
              <div className={styles.discount}>
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter discount code"
                  className={styles.discountInput}
                />
                <button
                  className={styles.discountButton}
                  onClick={handleApplyDiscount}
                >
                  Apply Discount
                </button>
                {discountApplied && (
                  <div className={styles.appliedDiscount}>
                    <span className={styles.codeFeedback}>{discountCode}</span>
                    <button
                      onClick={handleRemoveDiscount}
                      className={styles.removeDiscountButton}
                    >
                      x
                    </button>
                  </div>
                )}
                {errorMessage && (
                  <p className={styles.errorMessage}>{errorMessage}</p>
                )}
              </div>
              {/* <p className={styles.shippingMessage}>
                Shipping to be calculated
              </p> */}
              <button
                className={styles.checkoutButton}
                onClick={() =>
                  handleCheckout(cartItems, setLoading, discountApplied)
                }
              >
                Checkout
              </button>
              {/* <button className={styles.checkoutButton} onClick={clearCart}>
                Clear Cart
              </button> */}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Cart;
