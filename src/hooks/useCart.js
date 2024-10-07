import { useContext } from "react";
import { CartContext } from "../components/cartContext"; // Adjust the import based on your context file

const useCart = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

  return {
    cartItems,
    removeFromCart,
    clearCart,
    total,
    handleIncrease,
    handleDecrease,
  };
};

export default useCart;
