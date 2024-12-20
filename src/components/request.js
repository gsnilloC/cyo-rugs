import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "../styles/galleryWall.module.css";
import { placeholder } from "../assets/images";
import { IconButton, Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";

function Request() {
  const [images, setImages] = useState([null, null, null]);
  const [showTip, setShowTip] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    description: "",
  });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const newImages = [...images];
    for (let i = 0; i < files.length && i < 3; i++) {
      newImages[i] = files[i];
    }
    setImages(newImages);
  };

  const handleTipClick = () => {
    setShowTip(!showTip);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!recaptchaToken) {
    //   alert("Please complete the reCAPTCHA");
    //   return;
    // }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("recaptchaToken", recaptchaToken);

    images.forEach((image, index) => {
      if (image) {
        formDataToSend.append(`images`, image);
      }
    });

    try {
      const response = await axios.post("/api/upload", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFeedbackMessage("Upload successful!");
    } catch (error) {
      setFeedbackMessage("Error uploading form data. Please try again.");
    }
  };

  return (
    <div>
      <div className={styles.galleryWallContainer}>
        <h1>Customs Gallery</h1>
        <div className={styles.framesContainer}>
          {images.map((image, index) => (
            <div className={styles.outerFrame} key={index}>
              <div className={styles.frame}>
                <div className={styles.spotlight}></div>
                <img
                  src={image ? URL.createObjectURL(image) : placeholder}
                  alt={`Frame ${index + 1}`}
                  className={styles.image}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          className={styles.buttonContainer}
          style={{ marginTop: "-30px", marginBottom: "30px" }}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            ref={fileInputRef}
            id="upload-button"
          />
          <div className="upload-button">
            <Button
              variant="contained"
              color="primary"
              component="span"
              onClick={() => fileInputRef.current.click()}
            >
              Add Photos
            </Button>
          </div>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone (e.g., 123-456-7890)"
            value={formData.phone}
            onChange={handleInputChange}
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          {/* <ReCAPTCHA
            sitekey="YOUR_RECAPTCHA_SITE_KEY"
            onChange={(token) => setRecaptchaToken(token)}
          /> */}
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </form>
        {feedbackMessage && <p>{feedbackMessage}</p>}
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
                <strong>Size</strong>: Exact dimensions (in feet or inches) to
                fit your space perfectly.
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
                <strong>Material Preferences</strong>: If applicable, let us
                know your preferred texture or type of material (e.g., wool,
                cotton, etc.).
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
                Double-check your contact information (email and phone number)
                to avoid delays.
              </li>
              <li>
                If you have any questions or special requirements, don’t
                hesitate to include them in your request.
              </li>
            </ul>
            <p>
              We’re excited to collaborate with you and create a rug that’s as
              unique as you are! Start your custom rug request today, and let’s
              turn your idea into a masterpiece.
            </p>
          </div>
        )}
      </div>
      <div className={styles.floorContainer}></div>
    </div>
  );
}

export default Request;
