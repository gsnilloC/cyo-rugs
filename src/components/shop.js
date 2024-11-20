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
                <div className={styles.rugFrame}>
                  <img
                    src={rug.imageUrls[0]}
                    alt={rug.name}
                    className={styles.rugImage}
                  />
                </div>
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
        <span 
          onClick={handlePreviousPage} 
          className={`${styles.arrow} ${currentPage === 1 ? styles.disabled : ''}`}
        >
          ←
        </span>
        <div className={styles.pageNumbers}>
          {[...Array(totalPages)].map((_, index) => (
            <div key={index + 1} className={styles.pageNumberContainer}>
              <span
                className={`${styles.pageNumber} ${currentPage === index + 1 ? styles.activePage : ''}`}
                onClick={() => {
                  setCurrentPage(index + 1);
                  window.scrollTo(0, 0);
                }}
              >
                {index + 1}
              </span>
              {currentPage === index + 1 && <div className={styles.pageIndicator} />}
            </div>
          ))}
        </div>
        <span 
          onClick={handleNextPage} 
          className={`${styles.arrow} ${currentPage === totalPages ? styles.disabled : ''}`}
        >
          →
        </span>
      </div>
    </div>
  );
}

export default Shop;
