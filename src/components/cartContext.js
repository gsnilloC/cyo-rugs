import React, { createContext, useContext, useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        toast.info(`${item.name} quantity increased!`, {
          position: "bottom-center",
          autoClose: 2000,
          closeOnClick: true,
          draggable: false,
          pauseOnHover: false,
          hideProgressBar: true,
        });
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success(`${item.name} added to cart!`, {
        position: "bottom-center",
        autoClose: 2000,
        closeOnClick: true,
        draggable: false,
        pauseOnHover: false,
        hideProgressBar: true,
      });
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    const itemToRemove = cartItems.find((item) => item.id === itemId);
    if (itemToRemove) {
      toast.error(`${itemToRemove.name} removed from cart!`, {
        position: "bottom-center",
        autoClose: 2000,
        closeOnClick: true,
        draggable: false,
        pauseOnHover: false,
        hideProgressBar: true,
      });
    }
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    toast.warn("Cart cleared!", {
      position: "bottom-center",
      autoClose: 2000,
      closeOnClick: true,
      draggable: false,
      pauseOnHover: false,
      hideProgressBar: true,
    });
    setCartItems([]);
  };

  const updateQuantity = (itemId, quantity) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={true}
        closeOnClick
        draggable={false}
        pauseOnHover={false}
      />
    </CartContext.Provider>
  );
};

export { CartContext };
