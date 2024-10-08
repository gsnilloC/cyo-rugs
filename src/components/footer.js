import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import { DarkMode as DarkModeIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import styles from "../styles/footer.module.css";

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
