import React, { useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import { DarkMode as DarkModeIcon, Key as KeyIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import LoginModal from "./LoginModal";

const Footer = ({ toggleTheme }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const iconStyle = {
    color: "var(--icon-color)",
    transition: "color 0.3s ease",
  };

  return (
    <footer>
      <div className="footer-divider"></div>
      <div className="footer-top">
        <a
          href="https://www.instagram.com/cyorugs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon style={iconStyle} />
        </a>
        <IconButton onClick={toggleTheme} className="theme-toggle">
          <DarkModeIcon style={iconStyle} />
        </IconButton>
        <IconButton onClick={() => setIsLoginModalOpen(true)}>
          <KeyIcon style={iconStyle} />
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
