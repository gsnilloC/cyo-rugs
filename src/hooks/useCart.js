import { useContext } from "react";
import { CartContext } from "../components/cartContext";
import axios from "axios";

const useCart = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } =
    useContext(CartContext);

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

  const handleCheckout = async (cartItems, setLoading) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/checkout", { cartItems });
      const { checkoutLink } = response.data;

      if (checkoutLink) {
        setTimeout(() => {
          window.location.href = checkoutLink;
        }, 3000);
      }

      localStorage.removeItem("cartItems");
    } catch (error) {
      const errorMessage = error.response.data.error;
      alert("Failed to initiate checkout:" + errorMessage);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3500);
    }
  };

  return {
    cartItems,
    removeFromCart,
    clearCart,
    total,
    handleIncrease,
    handleDecrease,
    handleCheckout,
  };
};

export default useCart;
