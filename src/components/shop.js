import React from "react";
import styles from "../styles/shop.module.css";
import { Link } from "react-router-dom";
import useShop from "../hooks/useShop";

function Shop() {
  const { paginatedRugs, loading, error, currentPage, setCurrentPage, totalPages } = useShop();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching items: {error.message}</div>;
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div>
      <h1 className={styles.shopTitle}>Rugs</h1>
      <div className={styles.shopContainer}>
        <div className={styles.rugGrid}>
          {paginatedRugs.map((rug) => {
            if (!rug) return null;
            return (
              <Link
                to={`/product/${rug.id}`}
                key={rug.id}
                className={`${styles.rugItem} ${rug.inventoryCount === 0 ? styles.soldOut : ""}`}
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
      <div className={styles.pagination}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          ←
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          →
        </button>
      </div>
    </div>
  );
}

export default Shop;
