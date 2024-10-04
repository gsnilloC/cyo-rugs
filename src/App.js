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

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
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
    setIsDrawerOpen(!isDrawerOpen);
  };

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

  return (
    <div className="App">
      <header>
        {/* Conditionally render the nav only if not on the Password Page */}
        {window.location.pathname !== "/" && (
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
        )}
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
          <Route path="/" element={<PasswordPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/request" element={<Request />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:id" element={<Product />} />
        </Routes>
      </main>

      {/* Conditionally render the footer only on the Password Page */}
      <footer
        style={{ display: window.location.pathname === "/" ? "block" : "none" }}
      >
        <div className="footer-divider"></div>
        <div className="footer-top">
          {/* <a href="/about">Meet the Artist</a> */}
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
    </div>
  );
}

export default App;
