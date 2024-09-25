import React from "react";
import { Routes, Route, Link } from "react-router-dom";
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
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="App">
      <header>
        <nav>
          <div className="nav-left">
            <IconButton onClick={handleMenuClick}>
              <Menu />
            </IconButton>
            <MuiMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <Link to="/">Home</Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/shop">Shop</Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/cart">Cart</Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/request">Request</Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/about">About Us</Link>
              </MenuItem>
            </MuiMenu>
          </div>
          <div className="logo">
            <Link to="/">
              <img src={logoImage} alt="CYO Rugs Logo" />
            </Link>
          </div>
          <div className="nav-right">
            <IconButton>
              <ShoppingCart />
            </IconButton>
          </div>
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
