import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Home,
  Shop,
  Cart,
  Request,
  About,
  PasswordPage,
  Product,
} from "./components";
import "./App.css";
import { useCart } from "./components/cartContext"; // Import useCart
import Navbar from "./components/navbar"; // Import Navbar
import Footer from "./components/footer"; // Import Footer

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();
  const { cartItems } = useCart(); // Get cart items from context
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0); // Calculate total items

  // Toggle theme with safe checks
  const toggleTheme = () => {
    if (theme === "light" || theme === "dark") {
      setTheme(theme === "light" ? "dark" : "light");
    }
  };

  // Apply the theme to the body
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  // Update `isMobile` state when window resizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Safely toggle the drawer
  const handleDrawerToggle = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const navItems = [
    { path: "/home", label: "HOME" },
    { path: "/shop", label: "SHOP" },
    { path: "/request", label: "REQUEST" },
    { path: "/about", label: "ABOUT" },
  ];

  // Fallback for window location
  const currentPath = window?.location?.pathname || "/home";

  return (
    <div className="App">
      <Navbar
        isMobile={isMobile}
        isDrawerOpen={isDrawerOpen}
        handleDrawerToggle={handleDrawerToggle}
        totalItems={totalItems}
        navItems={navItems}
        currentPath={currentPath}
        navigate={navigate}
      />
      <main>
        <Routes>
          <Route path="/" element={<PasswordPage />} />{" "}
          {/* Password Page first */}
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/request" element={<Request />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:id" element={<Product />} />
        </Routes>
      </main>
      <Footer toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
