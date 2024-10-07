import React from "react";
import styles from "../styles/shop.module.css";
import { Link } from "react-router-dom"; // Import Link component
import useShop from "../hooks/useShop"; // Import the new useShop hook

function Shop() {
  const { rugs, loading, error } = useShop(); // Use the custom hook

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
