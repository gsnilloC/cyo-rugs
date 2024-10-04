import React, { useEffect, useState } from "react";
import styles from "../styles/shop.module.css";
import axios from "axios";

function Shop() {
  const [rugs, setRugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRugs = async () => {
      try {
        const response = await axios.get("/api/items");
        console.log("Fetched items:", response.data.items); // Adjust based on the API response
        setRugs(response.data.items || []); // Adjust based on the correct data structure
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRugs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching items: {error.message}</div>;
  }

  return (
    <div>
      <h1 className={styles.shopTitle}>Rugs</h1>
      <div className={styles.shopContainer}>
        <div className={styles.rugGrid}>
          {Array.isArray(rugs) && rugs.length > 0 ? (
            rugs.map((rug) => (
              <div key={rug.id} className={styles.rugItem}>
                {Array.isArray(rug.imageUrls) && rug.imageUrls.length > 0 ? (
                  <img
                    src={rug.imageUrls[0]}
                    alt={rug.name}
                    className={styles.rugImage}
                  />
                ) : (
                  <div className={styles.placeholderImage}>
                    No Image Available
                  </div>
                )}
                <div className={styles.rugInfo}>
                  <h2 className={styles.rugName}>{rug.name}</h2>
                  <p className={styles.rugDescription}>{rug.description}</p>
                  <p className={styles.rugPrice}>
                    ${rug.price ? rug.price.toFixed(2) : "N/A"}
                  </p>
                  <button className={styles.addToCartButton}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No rugs available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
