import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconButton, Drawer, MenuItem } from "@mui/material";
import { Menu, Close as CloseIcon } from "@mui/icons-material";
import { ShoppingCart } from "lucide-react";
import logoImage from "../assets/images/logo.JPG";

const Navbar = ({ isMobile, isDrawerOpen, handleDrawerToggle, totalItems }) => {
  const navigate = useNavigate();

  const navItems = [
    { path: "/home", label: "HOME" },
    { path: "/shop", label: "SHOP" },
    { path: "/request", label: "REQUEST" },
    { path: "/about", label: "ABOUT" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    handleDrawerToggle();
  };

  const iconStyle = {
    color: "var(--icon-color)",
    transition: "color 0.3s ease",
  };

  return (
    <header>
      <nav className={isMobile ? "mobile-nav" : "desktop-nav"}>
        {isMobile ? (
          <>
            <div className="nav-left">
              <IconButton onClick={handleDrawerToggle}>
                {isDrawerOpen ? (
                  <CloseIcon style={iconStyle} />
                ) : (
                  <Menu style={iconStyle} />
                )}
              </IconButton>
            </div>
            <div className="logo">
              <Link to="/home">
                <img src={logoImage} alt="CYO Rugs Logo" />
              </Link>
            </div>
            <div className="nav-right">
              <IconButton
                onClick={() => navigate("/cart")}
                style={{ position: "relative" }}
              >
                <ShoppingCart style={{ ...iconStyle, fontSize: "2rem" }} />
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
                <ShoppingCart style={{ ...iconStyle, fontSize: "2rem" }} />
                {totalItems > 0 && (
                  <span className="cart-quantity-badge">{totalItems}</span>
                )}
              </IconButton>
            </div>
          </>
        )}
      </nav>
      {isMobile && (
        <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerToggle}>
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
