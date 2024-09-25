import React, { useState } from "react";
import styles from "./Request.module.css";

function Request() {
  const [rugImage, setRugImage] = useState(null);
  const [wallImage, setWallImage] = useState(null);

  const handleRugUpload = (event) => {
    const file = event.target.files[0];
    setRugImage(URL.createObjectURL(file));
  };

  const handleWallUpload = (event) => {
    const file = event.target.files[0];
    setWallImage(URL.createObjectURL(file));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement form submission logic here
    console.log("Form submitted");
  };

  return (
    <div className={styles.requestContainer}>
      <h1>Custom Rug Request</h1>
      <div className={styles.roomPreview}>
        <div
          className={styles.rugSpace}
          onClick={() => document.getElementById("rugUpload").click()}
        >
          {rugImage ? (
            <img
              src={rugImage}
              alt="Custom rug"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <p className={styles.uploadText}>Click to upload rug design</p>
          )}
        </div>
        <div
          className={styles.wallSpace}
          onClick={() => document.getElementById("wallUpload").click()}
        >
          {wallImage ? (
            <img
              src={wallImage}
              alt="Wall art"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <p className={styles.uploadText}>Click to upload wall art</p>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit} className={styles.requestForm}>
        <input type="file" id="rugUpload" hidden onChange={handleRugUpload} />
        <input type="file" id="wallUpload" hidden onChange={handleWallUpload} />
        <input
          type="text"
          placeholder="Rug dimensions"
          className={styles.formInput}
        />
        <textarea
          placeholder="Additional details"
          className={styles.formInput}
        ></textarea>
        <button type="submit" className={styles.submitButton}>
          Submit Request
        </button>
      </form>
    </div>
  );
}

export default Request;
