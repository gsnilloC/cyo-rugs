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
  RequestList,
} from "./components";
import "./App.css";
import { useCart } from "./components/cartContext";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleTheme = () => {
    if (theme === "light" || theme === "dark") {
      setTheme(theme === "light" ? "dark" : "light");
    }
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDrawerToggle = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const currentPath = window?.location?.pathname || "/home";

  return (
    <div className="App">
      <Navbar
        isMobile={isMobile}
        isDrawerOpen={isDrawerOpen}
        handleDrawerToggle={handleDrawerToggle}
        totalItems={totalItems}
        currentPath={currentPath}
        navigate={navigate}
      />
      <main>
        <Routes>
          <Route path="/" element={<PasswordPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/request" element={<Request />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/list" element={<RequestList />} />
        </Routes>
      </main>
      <Footer toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
