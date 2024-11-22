import React, { useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import { DarkMode as DarkModeIcon, Key as KeyIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import LoginModal from "./LoginModal";

const Footer = ({ toggleTheme }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
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
        <IconButton onClick={() => setIsLoginModalOpen(true)}>
          <KeyIcon />
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
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </footer>
  );
};

export default Footer;
