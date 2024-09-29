import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Shop from "./components/Shop";
import Cart from "./components/Cart";
import Request from "./components/Request";
import About from "./components/About";
import "./App.css";
import { Menu } from "@mui/icons-material";
import { ShoppingCart } from "lucide-react";
import { IconButton, Drawer, MenuItem } from "@mui/material";
import logoImage from "./assets/images/logo.JPG";
import CloseIcon from "@mui/icons-material/Close";
import InstagramIcon from "@mui/icons-material/Instagram";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsDrawerOpen(false);
  };

  const navItems = [
    { path: "/", label: "HOME" },
    { path: "/shop", label: "SHOP" },
    { path: "/request", label: "REQUEST" },
    { path: "/about", label: "ABOUT" },
  ];

  return (
    <div className="App">
      <header>
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
                <IconButton onClick={() => navigate("/cart")}>
                  <ShoppingCart fontSize="large" />
                </IconButton>
              </div>
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
        {isMobile && (
          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={handleDrawerToggle}
            variant="persistent"
            className="mobile-drawer"
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
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/request" element={<Request />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer>
        <div className="footer-divider"></div>
        <div className="footer-top">
          <a href="/about">Meet the Artist</a>
          <a
            href="https://www.instagram.com/cyorugs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
          </a>
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
    </div>
  );
}

export default App;
