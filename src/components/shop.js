import React from "react";
import styles from "../styles/shop.module.css";
import { Link } from "react-router-dom";
import useShop from "../hooks/useShop";

function Shop() {
  const { rugs, loading, error } = useShop();

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
          {rugs.map((rug) => {
            if (!rug) return null;
            return (
              <Link
                to={`/product/${rug.id}`}
                key={rug.id}
                className={`${styles.rugItem} ${
                  rug.inventoryCount === 0 ? styles.soldOut : ""
                }`}
              >
                <img
                  src={rug.imageUrls[0]}
                  alt={rug.name}
                  className={styles.rugImage}
                />
                <div className={styles.rugInfo}>
                  <p className={styles.rugName}>{rug.name}</p>
                  <p className={styles.rugPrice}>${rug.price.toFixed(2)} USD</p>
                  {rug.inventoryCount === 0 && (
                    <div className={styles.soldOutMessage}>Sold Out</div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Shop;
