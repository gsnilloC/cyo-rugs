import React from "react";
// import ReCAPTCHA from "react-google-recaptcha";
import styles from "../styles/galleryWall.module.css";
import { placeholder } from "../assets/images";
import { IconButton, Modal, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import closedSign from "../assets/images/closed-sign-illustration-transparent-png.png";
import useRequestForm from "../hooks/useRequestForm";

function Request() {
  const {
    images,
    formData,
    isModalOpen,
    isClosedSignVisible,
    isLoading,
    fileInputRef,
    handleImageUpload,
    handleRemoveImage,
    setIsModalOpen,
    handleInputChange,
    handleSubmit,
  } = useRequestForm();

  return (
    <div>
      <ToastContainer />
      {isClosedSignVisible && (
        <>
          <img
            src={closedSign}
            alt="Closed Sign"
            className={styles.closedSign}
          />
          <div className={styles.overlay}></div>
        </>
      )}
      <div className={styles.galleryWallContainer}>
        <h1 className={styles.reqTitle}>Customs Gallery</h1>
        <button
          onClick={() => setIsModalOpen(true)}
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
          <button className={styles.button} type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
      <div className={styles.floorContainer}></div>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
            onClick={() => setIsModalOpen(false)}
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
              perfectly. (UP to 5 FEET❗)
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
              I'll provide you with a quote for you to place an order. The
              shipping price will then be calculated after rug is finished and
              weighed for shipment.
            </li>
            <li>
              A deposit of half the item's price will be made upon acceptance of
              order, paying the remaining amount once complete.
            </li>
          </ul>
          <p className="pgh" style={{ marginTop: "1rem" }}>
            excited to collaborate with you and create a rug that's as
            unique as you are! Start your custom rug request today, and let's
            turn your idea into a masterpiece.
          </p>
        </Box>
      </Modal>
    </div>
  );
}

export default Request;
