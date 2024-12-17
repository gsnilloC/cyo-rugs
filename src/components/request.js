import React, { useState } from "react";
import styles from "../styles/galleryWall.module.css";
import { placeholder } from "../assets/images";
import { IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

function Request() {
  const [images, setImages] = useState([null, null, null]);
  const [showTip, setShowTip] = useState(false);

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(file);
      setImages(newImages);
    }
  };

  const handleTipClick = () => {
    setShowTip(!showTip);
  };

  return (
    <div className={styles.galleryWallContainer}>
      <h1>Customs Gallery</h1>
      <div className={styles.framesContainer}>
        {images.map((image, index) => (
          <div className={styles.outerFrame}>
            <div key={index} className={styles.frame}>
              <div className={styles.spotlight}></div>
              <img
                src={image || placeholder}
                alt={`Frame ${index + 1}`}
                className={styles.image}
              />
            </div>
            <input
              className={styles.uploadInput}
              type="file"
              onChange={(e) => handleImageUpload(index, e)}
            />
          </div>
        ))}
        <IconButton
          onClick={handleTipClick}
          style={{
            position: "absolute",
            bottom: "-70px",
            right: "20px",
            backgroundColor: "var(--primary-color)",
            color: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <InfoIcon />
        </IconButton>
      </div>
      {showTip && (
        <div className={styles.requestContainer}>
          <h1>Bring Your Vision to Life!</h1>
          <p>
            Grab a personalized rug tailored to your vision. Whether it's a
            specific design, size, color scheme, or theme, we bring your ideas
            to life.
          </p>
          <p>
            To ensure your custom rug is everything you’ve dreamed of, please
            provide detailed and accurate information in your request. Include
            specifics such as:
          </p>
          <ul>
            <li>
              <strong>Size</strong>: Exact dimensions (in feet or inches) to fit
              your space perfectly.
            </li>
            <li>
              <strong>Design</strong>: Attach clear references, sketches, or
              describe your design as vividly as possible.
            </li>
            <li>
              <strong>Colors</strong>: Mention preferred color schemes or
              specific shades.
            </li>
            <li>
              <strong>Material Preferences</strong>: If applicable, let us know
              your preferred texture or type of material (e.g., wool, cotton,
              etc.).
            </li>
          </ul>
          <p>
            💡 <strong>Tip</strong>: The more precise your details, the better
            we can meet your expectations!
          </p>
          <p>
            <strong>Important:</strong>
          </p>
          <ul>
            <li>
              Double-check your contact information (email and phone number) to
              avoid delays.
            </li>
            <li>
              If you have any questions or special requirements, don’t hesitate
              to include them in your request.
            </li>
          </ul>
          <p>
            We’re excited to collaborate with you and create a rug that’s as
            unique as you are! Start your custom rug request today, and let’s
            turn your idea into a masterpiece.
          </p>
        </div>
      )}
      <div className={styles.galleryFloorContainer}></div>
    </div>
  );
}

export default Request;
