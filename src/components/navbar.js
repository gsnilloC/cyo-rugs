import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useNavigate
import { IconButton, Drawer, MenuItem } from "@mui/material"; // Import Drawer and MenuItem
import { Menu, Close as CloseIcon } from "@mui/icons-material";
import { ShoppingCart } from "lucide-react";
// import { useCart } from "./cartContext"; // Import useCart
import logoImage from "../assests/images/logo.JPG";

const Navbar = ({ isMobile, isDrawerOpen, handleDrawerToggle, totalItems }) => {
  const navigate = useNavigate(); // Get the
  const location = useLocation();
  const currentPath = location.pathname; // Get the current pathnavigate function

  const navItems = [
    { path: "/home", label: "HOME" },
    { path: "/shop", label: "SHOP" },
    { path: "/request", label: "REQUEST" },
    { path: "/about", label: "ABOUT" },
  ];

  // Handle navigation and close drawer
  const handleNavigation = (path) => {
    navigate(path);
    handleDrawerToggle(); // Close the drawer after navigation
  };

  return (
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
                  <ShoppingCart fontSize="large" style={{ fontSize: "2rem" }} />
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
                  <ShoppingCart fontSize="large" style={{ fontSize: "2rem" }} />
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
  );
};

export default Navbar;
