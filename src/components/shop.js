import React from "react";
import styles from "../styles/shop.module.css";
import { Link } from "react-router-dom";
import useShop from "../hooks/useShop";
import { Box, CircularProgress } from "@mui/material";

function Shop() {
  const {
    paginatedRugs,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useShop();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
        position="fixed"
        top="0"
        left="0"
        bgcolor="rgba(255, 255, 255, 0.8)"
        zIndex="9999"
      >
        <CircularProgress size={100} />
      </Box>
    );
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
      <h1 className={styles.shopTitle}>Hand Tufted Rugs</h1>
      <div className={styles.shopContainer}>
        <div className={styles.rugGrid}>
          {paginatedRugs.map((rug) => {
            if (!rug || !rug.price) return null;
            return (
              <Link
                to={`/product/${rug.id}`}
                key={rug.id}
                className={`${styles.rugItem} ${
                  rug.inventoryCount === 0 ? styles.soldOut : ""
                }`}
              >
                <div>
                  <img
                    src={rug.imageUrls[0]}
                    alt={rug.name}
                    className={styles.rugImage}
                  />
                </div>
                <div className={styles.rugInfo}>
                  <p className={styles.rugName}>{rug.name}</p>
                  <p className={styles.rugPrice}>
                    ${(rug.price || 0).toFixed(2)} USD
                  </p>
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
          className={`${styles.arrow} ${
            currentPage === 1 ? styles.disabled : ""
          }`}
        >
          ←
        </span>
        <div className={styles.pageNumbers}>
          {[...Array(totalPages)].map((_, index) => (
            <div key={index + 1} className={styles.pageNumberContainer}>
              <span
                className={`${styles.pageNumber} ${
                  currentPage === index + 1 ? styles.activePage : ""
                }`}
                onClick={() => {
                  setCurrentPage(index + 1);
                  window.scrollTo(0, 0);
                }}
              >
                {index + 1}
              </span>
              {currentPage === index + 1 && (
                <div className={styles.pageIndicator} />
              )}
            </div>
          ))}
        </div>
        <span
          onClick={handleNextPage}
          className={`${styles.arrow} ${
            currentPage === totalPages ? styles.disabled : ""
          }`}
        >
          →
        </span>
      </div>
    </div>
  );
}

export default Shop;
