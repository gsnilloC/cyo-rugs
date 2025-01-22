import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "../styles/galleryWall.module.css";
import { placeholder } from "../assets/images";
import { IconButton, Modal, Box, Switch } from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import closedSign from "../assets/images/closed-sign-illustration-transparent-png.png";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosedSignVisible, setIsClosedSignVisible] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const newImages = [...images];
    for (let i = 0; i < files.length && i < 3; i++) {
      newImages[i] = files[i];
    }
    setImages(newImages);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleTipClick = () => {
    setShowTip(!showTip);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const cleaned = ("" + value).replace(/\D/g, "");
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

      if (match) {
        const formattedNumber = [match[1], match[2], match[3]]
          .filter(Boolean)
          .join("-");
        setFormData({ ...formData, [name]: formattedNumber });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      toast.success("Upload successful!");
      navigate("/");
    } catch (error) {
      toast.error("Error uploading form data. Please try again.");
    }
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <div>
      <ToastContainer />
      {isClosedSignVisible && (
        <img src={closedSign} alt="Closed Sign" className={styles.closedSign} />
      )}
      <div className={styles.galleryWallContainer}>
        <h1>Customs Gallery</h1>
        <button
          onClick={handleModalOpen}
          className={`${styles.button} ${styles.readFirstButton}`}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        >
          Read First
        </button>
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
                {image && (
                  <IconButton
                    className={styles.trashIcon}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
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
            <button
              className={styles.upload}
              onClick={() => fileInputRef.current.click()}
            >
              Add Photos
            </button>
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
          <button className={styles.button} type="submit">
            Submit
          </button>
        </form>
      </div>
      <div className={styles.floorContainer}></div>
      <div>
        {/* <span>Toggle Closed Sign</span> */}
        <Switch
          checked={isClosedSignVisible}
          onChange={() => setIsClosedSignVisible(!isClosedSignVisible)}
          color="primary"
        />
      </div>
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        className={styles.requestContainer}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 900 },
            height: { xs: "95%", sm: "auto" },
            maxHeight: { xs: "80vh", sm: "none" },
            overflowY: { xs: "auto", sm: "visible" },
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            padding: { xs: 3, sm: 4 },
            typography: { xs: "body2", sm: "body1" },
          }}
        >
          <IconButton
            onClick={handleModalClose}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "var(--text-color)",
            }}
          >
            <CloseIcon />
          </IconButton>
          <h2>Tips!</h2>
          <p>Bring Your Vision to Life!</p>
          <p>
            Grab a personalized rug tailored to your vision. Whether it's a
            specific design, size, color scheme, or theme, I bring your ideas to
            life.
          </p>
          <p>
            To ensure your custom rug is everything you've dreamed of, please
            provide detailed and accurate information in your request. Include
            specifics such as:
          </p>
          <ul>
            <li>
              Size: Exact dimensions (in feet or inches) to fit your space
              perfectly.
            </li>
            <li>
              Design: Attach clear references, sketches, or describe your design
              as vividly as possible.
            </li>
            <li>Colors: Mention preferred color schemes or specific shades.</li>
            <li>
              Material Preferences: If applicable, let us know your preferred
              texture or type of material (e.g., wool, cotton, etc.).
            </li>
          </ul>
          <p>
            💡 Tip: The more precise your details, the better I can meet your
            expectations!
          </p>
          <h3>Important:</h3>
          <ul>
            <li>
              Double-check your contact information (email and phone number) to
              avoid delays.
            </li>
            <li>
              If you have any questions or special requirements, don't hesitate
              to include them in your request.
            </li>
            <li>
              Shipping price will be calculated after rug is finished and
              weighed for shipment. I'll provide you with a quote for you to
              place an order.
            </li>
          </ul>
          <p className="pgh" style={{ marginTop: "1rem" }}>
            We're excited to collaborate with you and create a rug that's as
            unique as you are! Start your custom rug request today, and let's
            turn your idea into a masterpiece.
          </p>
        </Box>
      </Modal>
    </div>
  );
}

export default Request;
