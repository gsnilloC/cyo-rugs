import React, { useEffect, useState } from "react";
import styles from "../styles/shop.module.css";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link component

function Shop() {
  const [rugs, setRugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRugs = async () => {
      try {
        const response = await axios.get("/api/items");
        setRugs(response.data);
      } catch (err) {
        console.error("Error fetching rugs:", err);
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
          {rugs.map((rug) => (
            <Link
              to={`/product/${rug.id}`}
              key={rug.id}
              className={styles.rugItem}
            >
              <img
                src={rug.imageUrls[0]}
                alt={rug.name}
                className={styles.rugImage}
              />
              <div className={styles.rugInfo}>
                <h2 className={styles.rugName}>{rug.name}</h2>
                <p className={styles.rugPrice}>${rug.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;
