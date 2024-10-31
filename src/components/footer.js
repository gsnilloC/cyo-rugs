import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import { DarkMode as DarkModeIcon, Key as KeyIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const Footer = ({ toggleTheme }) => {
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
        <a href="/home" className="footer-icon-link">
          <KeyIcon />
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
  );
};

export default Footer;
