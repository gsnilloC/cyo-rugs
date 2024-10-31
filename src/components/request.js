import React, { useState, useEffect } from "react";
import styles from "../styles/request.module.css";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

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
    if (files.length + formData.images.length <= 3) {
      setFormData({ ...formData, images: [...formData.images, ...files] });
    } else {
      alert("You can only upload up to 3 images.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("email", formData.email);
    data.append("description", formData.description);

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
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className={styles.requestContainer}>
      <h1>Custom Rug Request</h1>
      <button onClick={() => setShowModal(true)}>Rug</button>
      <button onClick={() => setShowModal(true)}>Wall Art</button>

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
              <button type="submit">Upload</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default Request;
