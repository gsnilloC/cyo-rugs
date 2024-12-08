import React, { useState, useEffect } from "react";
import styles from "../styles/product.module.css";
import useProduct from "../hooks/useProduct";
import {
  IconButton,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Add, Remove, ExpandMore } from "@mui/icons-material";

const Product = () => {
  const { rug, loading, error, handleAddToCart } = useProduct();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (rug && rug.v_names && rug.v_names.length > 0) {
      setSelectedColor(rug.v_names[0]);
    }
  }, [rug]);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const isVariationSoldOut = (index) => {
    return rug.v_quantities[index] === 0;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching item: {error.message}</div>;
  }

  if (!rug) {
    return <div>Product not found</div>;
  }

  return (
    <div className={styles.productContainer}>
      <div className={styles.productImageContainer}>
        <img
          src={rug.imageUrls[selectedImageIndex]}
          alt={rug.name}
          className={styles.productImage}
        />
        <div className={styles.imageThumbnails}>
          {rug.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Thumbnail ${index + 1}`}
              className={`${styles.thumbnail} ${
                index === selectedImageIndex ? styles.activeThumbnail : ""
              }`}
              onClick={() => setSelectedImageIndex(index)}
            />
          ))}
          <div className={styles.scrollIndicator}></div>
        </div>
      </div>
      <div className={styles.productDetails}>
        <h1 className={styles.productName}>{rug.name}</h1>
        <p className={styles.productPrice}>${rug.price.toFixed(2)} USD</p>
        {/* <p className={styles.productShipping}>
          Shipping calculated at checkout
        </p> */}
        <div className={styles.variationsContainer}>
          {rug.v_ids && rug.v_ids.length > 1 ? (
            rug.v_ids.map((variationId, index) => (
              <div key={index} className={styles.variation}>
                <div
                  className={`${styles.colorCircle} ${
                    rug.v_names[index] === selectedColor ? styles.activeColor : ''
                  } ${isVariationSoldOut(index) ? styles.soldOut : ''}`}
                  style={{
                    backgroundColor: rug.v_names[index].toLowerCase(),
                    border:
                      rug.v_names[index].toLowerCase() === "white"
                        ? "1px solid #ddd"
                        : "none",
                    cursor: isVariationSoldOut(index) ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => !isVariationSoldOut(index) && setSelectedColor(rug.v_names[index])}
                />
                <p>{rug.v_names[index]}</p>
              </div>
            ))
          ) : (
            <p> </p>
          )}
        </div>
        <div
          className={styles.quantityContainer}
          style={{
            backgroundColor: "var( --bg-color)",
            color: "var(--text-color)",
            borderRadius: "4px",
            padding: "0.5rem",
          }}
        >
          <IconButton onClick={handleDecrease} aria-label="decrease quantity">
            <Remove style={{ color: "var(--text-color)" }} />
          </IconButton>
          <TextField
            value={quantity}
            inputProps={{ readOnly: true }}
            InputProps={{
              style: {
                color: "var(--text-color)",
              },
            }}
            style={{
              width: "80px",
              textAlign: "center",
              borderRadius: "4px",
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--text-color)",
            }}
          />
          <IconButton onClick={handleIncrease} aria-label="increase quantity">
            <Add style={{ color: "var(--text-color)" }} />
          </IconButton>
        </div>
        <button
          className={styles.addToCartButton}
          onClick={() => handleAddToCart(quantity, selectedColor)}
        >
          Add to Cart
        </button>
        <div className={styles.productDescriptionContainer}>
          <p className={styles.productDescriptionTitle}>Product Details:</p>
          <p className={styles.productDescription}>{rug.description}</p>
        </div>
        <Accordion
          style={{
            boxShadow: "none",
            marginTop: "-1rem",
            backgroundColor: "var(--bg-color)",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore style={{ color: "var(--text-color)" }} />}
            aria-controls="product-care-content"
            id="product-care-header"
            style={{
              padding: 0,
              borderBottom: "none",
              color: "var(--text-color)",
            }}
          >
            <p style={{ margin: 0, color: "inherit", fontSize: "0.8rem" }}>
              Product Care Info
            </p>
          </AccordionSummary>
          <AccordionDetails style={{ color: "var(--text-color)" }}>
            <p className={styles.productCareInfo}>
              Vacuum regularly. Slight shedding is normal and will lessen over
              time.
              <br />
              Blot spills immediately with a clean, slightly damp cloth. Do not
              rub.
              <br />
              Professional cleaning can be used.
              <br />
              Upon delivery, give your rug a gentle shake to loosen the fibers.
            </p>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default Product;
