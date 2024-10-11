import React from "react";
import styles from "../styles/request.module.css";
import useRequest from "../hooks/useRequest";

function Request() {
  const {
    rugImage,
    wallImage,
    handleRugUpload,
    handleWallUpload,
    handleSubmit,
  } = useRequest();

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
              src={URL.createObjectURL(rugImage)} // Use object URL for preview
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
              src={URL.createObjectURL(wallImage)} // Use object URL for preview
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
      {/* Instructions code... */}
    </div>
  );
}

export default Request;
