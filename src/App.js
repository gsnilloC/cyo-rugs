import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Home,
  Shop,
  Cart,
  Request,
  About,
  Product,
  RequestList,
} from "./components";
import "./App.css";
import { useCart } from "./components/cartContext";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import audioFile from "./assets/audio/veezeTrapSmart.mp3";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [theme, setTheme] = useState("light");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null); // Ref to persist the audio instance

  const navigate = useNavigate();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
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

  useEffect(() => {
    // Initialize the audio instance
    if (!audioRef.current) {
      audioRef.current = new Audio(audioFile);
      audioRef.current.loop = true; // Ensure looping
    }
  }, []);

  const handleDrawerToggle = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="App">
      <Navbar
        isMobile={isMobile}
        isDrawerOpen={isDrawerOpen}
        handleDrawerToggle={handleDrawerToggle}
        totalItems={totalItems}
        navigate={navigate}
      />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
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
      <button
        className="music-button"
        onClick={toggleAudio}
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          backgroundColor: "var(--primary-color)",
          border: "none",
          borderRadius: "50%",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        {isPlaying ? (
          <MusicNoteIcon style={{ color: "white" }} />
        ) : (
          <VolumeOffIcon style={{ color: "white" }} />
        )}
      </button>
    </div>
  );
}

export default App;
