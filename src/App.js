import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Shop from "./components/Shop";
import Cart from "./components/Cart";
import Request from "./components/Request";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/request">Custom Request</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/request" element={<Request />} />
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
