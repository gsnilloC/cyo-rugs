import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
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
import { Menu, Close as CloseIcon } from "@mui/icons-material";
import { ShoppingCart } from "lucide-react";
import { IconButton, Drawer, MenuItem } from "@mui/material";
import { logoImage } from "./assets/images";
import InstagramIcon from "@mui/icons-material/Instagram";
import { DarkMode as DarkModeIcon } from "@mui/icons-material";
import { ToastContainer } from "react-toastify";
import { useCart } from "./components/cartContext"; // Import useCart

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

  // Handle navigation and close drawer
  const handleNavigation = (path) => {
    navigate(path);
    setIsDrawerOpen(false);
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
      <header>
        {/* Conditionally render the nav only if not on the Password Page */}
        {currentPath !== "/" && (
          <nav className={isMobile ? "mobile-nav" : "desktop-nav"}>
            {isMobile ? (
              <>
                <div className="nav-left">
                  <IconButton onClick={handleDrawerToggle}>
                    {isDrawerOpen ? <CloseIcon /> : <Menu />}
                  </IconButton>
                </div>
                <div className="logo">
                  <Link to="/">
                    <img src={logoImage} alt="CYO Rugs Logo" />
                  </Link>
                </div>
                <div className="nav-right">
                  <IconButton
                    onClick={() => navigate("/cart")}
                    style={{ position: "relative" }}
                  >
                    <ShoppingCart
                      fontSize="large"
                      style={{ fontSize: "2rem" }}
                    />
                    {totalItems > 0 && (
                      <span className="cart-quantity-badge">{totalItems}</span>
                    )}
                  </IconButton>
                </div>
              </>
            ) : (
              <>
                <div className="logo">
                  <Link to="/home">
                    <img src={logoImage} alt="CYO Rugs Logo" />
                  </Link>
                </div>
                <div className="nav-links">
                  {navItems.map((item) => (
                    <Link key={item.path} to={item.path}>
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="nav-right">
                  <IconButton
                    onClick={() => navigate("/cart")}
                    style={{ position: "relative" }}
                  >
                    <ShoppingCart
                      fontSize="large"
                      style={{ fontSize: "2rem" }}
                    />
                    {totalItems > 0 && (
                      <span className="cart-quantity-badge">{totalItems}</span>
                    )}
                  </IconButton>
                </div>
              </>
            )}
          </nav>
        )}
        {isMobile && (
          <Drawer
            anchor="left"
            open={isDrawerOpen} // Ensure open is valid boolean
            onClose={handleDrawerToggle}
          >
            <div className="mobile-menu">
              {navItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </MenuItem>
              ))}
            </div>
          </Drawer>
        )}
      </header>
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
      <footer>
        <div className="footer-divider"></div>
        <div className="footer-top">
          <a
            href="https://www.instagram.com/cyorugs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
          </a>
          <IconButton onClick={toggleTheme} className="theme-toggle">
            <DarkModeIcon />
          </IconButton>
        </div>
        <div className="footer-bottom">
          <a
            href="https://www.linkedin.com/in/collinsgichohi/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Made with ❤️
          </a>
        </div>
      </footer>
      <ToastContainer /> {/* For toasts */}
    </div>
  );
}

export default App;
