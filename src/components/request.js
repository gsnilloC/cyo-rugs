import React, { useState, useEffect } from "react";
import styles from "../styles/request.module.css";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

function Request() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    description: "",
    images: [],
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a supported image type`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length + formData.images.length <= 3) {
      setFormData({ ...formData, images: [...formData.images, ...validFiles] });
    } else {
      alert("You can only upload up to 3 images.");
    }
  };

  const validateForm = (formData) => {
    const errors = [];

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      errors.push("Please enter a valid phone number");
    }

    // Description length
    if (formData.description.length < 10) {
      errors.push("Description must be at least 10 characters long");
    }

    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
      return;
    }

    if (!recaptchaValue) {
      alert("Please verify that you are human");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("email", formData.email);
    data.append("description", formData.description);
    data.append("recaptchaToken", recaptchaValue);

    formData.images.forEach((image) => {
      data.append("images", image);
    });

    try {
      const response = await axios.post("/api/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload successful:", response.data);
      setUploadSuccess(true);
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Upload failed. Please try again.");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleRecaptchaChange = (value) => {
    console.log("reCAPTCHA value:", value);
    setRecaptchaValue(value);
  };

  return (
    <div className={styles.requestContainer}>
      <h1>Custom Requests</h1>
      <button onClick={() => setShowModal(true)} className={styles.button}>
        Rug
      </button>
      <button onClick={() => setShowModal(true)} className={styles.button}>
        Wall Art
      </button>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            {uploadSuccess ? (
              <p>Successfully Uploaded! We will reach out soon!</p>
            ) : (
              <p>Customs. Please be specific about any details!</p>
            )}
            <CloseIcon
              className={styles.closeIcon}
              onClick={() => setShowModal(false)}
            />
          </div>
          {!uploadSuccess && (
            <form onSubmit={handleFormSubmit} className={styles.requestForm}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
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
                className={styles.descriptionTextarea}
              ></textarea>
              <input
                type="file"
                onChange={handleImageUpload}
                multiple
                accept="image/png, image/jpeg, image/jpg, image/gif"
              />
              <p>{formData.images.length}/3 images uploaded</p>
              <div className={styles.imagePreviewContainer}>
                {formData.images.map((image, index) => (
                  <div key={index} className={styles.imageWrapper}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload Preview ${index + 1}`}
                      className={styles.imagePreview}
                    />
                    <span
                      className={styles.removeImage}
                      onClick={() => handleRemoveImage(index)}
                    >
                      &times;
                    </span>
                  </div>
                ))}
              </div>
              <ReCAPTCHA
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                onChange={handleRecaptchaChange}
              />
              <button type="submit">Upload</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default Request;
