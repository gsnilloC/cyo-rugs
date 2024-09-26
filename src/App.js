import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Shop from "./components/Shop";
import Cart from "./components/Cart";
import Request from "./components/Request";
import About from "./components/About";
import "./App.css";
import { Menu, ShoppingCart } from "@mui/icons-material";
import { IconButton, Menu as MuiMenu, MenuItem } from "@mui/material";
import logoImage from "./images/logo.JPG"; // Assuming you have a logo image

function App() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/shop", label: "Shop" },
    { path: "/request", label: "Request" },
    { path: "/about", label: "About" },
  ];

  return (
    <div className="App">
      <header>
        <nav className={isMobile ? "mobile-nav" : "desktop-nav"}>
          {isMobile ? (
            <>
              <div className="nav-left">
                <IconButton onClick={handleMenuClick}>
                  <Menu />
                </IconButton>
              </div>
              <div className="logo">
                <Link to="/">
                  <img src={logoImage} alt="CYO Rugs Logo" />
                </Link>
              </div>
              <div className="nav-right">
                <IconButton onClick={() => navigate("/cart")}>
                  <ShoppingCart />
                </IconButton>
              </div>
              <MuiMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </MuiMenu>
            </>
          ) : (
            <>
              <div className="logo">
                <Link to="/">
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
              <div className="cart-icon">
                <IconButton onClick={() => navigate("/cart")}>
                  <ShoppingCart />
                </IconButton>
              </div>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/request" element={<Request />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer>
        <a
          href="https://www.instagram.com/your-instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://www.linkedin.com/in/your-linkedin"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with Love
        </a>
      </footer>
    </div>
  );
}

export default App;
