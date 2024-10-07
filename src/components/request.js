import React from "react";
import styles from "../styles/request.module.css";
import useRequest from "../hooks/useRequest"; // Import the new useRequest hook

function Request() {
  const {
    rugImage,
    wallImage,
    handleRugUpload,
    handleWallUpload,
    handleSubmit,
  } = useRequest(); // Use the custom hook

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
      <div
        className={styles.instructions}
        style={{ border: "2px solid red", padding: "20px", margin: "20px 0" }}
      >
        <h2>Important Instructions</h2>
        <ol>
          <li>
            Please have a clear image of what you want ready to send. This
            ensures an accurate quote based on image & detail, knowing exactly
            what you want.
          </li>
          <li>
            Know about what size you want your rug made, as it's considered in
            the quote. We're currently making rugs up to 5ft long. Please
            clarify your preferred rug shape. Rugs can be outlined to the image,
            circled, squared, triangle, & rectangle.
          </li>
          <li>
            A 50% deposit is required to lock in your order. The rest is due
            upon rug completion. Shipping is also calculated upon completion &
            weighing of the rug.
          </li>
          <li>
            Depending on current order volume please be understanding of
            possible wait time of 2 weeks - 1 month to start your rug. (For
            those who haven't locked in an order) (Schedule updates will be
            posted as needed)
          </li>
          <li>
            Payment options include Zelle, Cashapp, PayPal, & Cash (if in
            person).
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Request;
