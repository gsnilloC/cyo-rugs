import React, { useState } from "react";
import styles from "../styles/product.module.css";
import useProduct from "../hooks/useProduct";
// import useShop from "../hooks/useShop";
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
  // const { paginatedRugs } = useShop();
  // // const [relatedProducts, setRelatedProducts] = useState([]);

  // useEffect(() => {
  //   if (paginatedRugs.length > 0) {
  //     setRelatedProducts(paginatedRugs.slice(0, 3));
  //   }
  // }, [paginatedRugs]);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

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
      <img
        src={rug.imageUrls[0]}
        alt={rug.name}
        className={styles.productImage}
      />
      <div className={styles.productDetails}>
        <h1 className={styles.productName}>{rug.name}</h1>
        <p className={styles.productPrice}>${rug.price.toFixed(2)} USD</p>
        <p className={styles.productShipping}>
          Shipping calculated at checkout
        </p>
        <div className={styles.quantityContainer}>
          <IconButton onClick={handleDecrease} aria-label="decrease quantity">
            <Remove />
          </IconButton>
          <TextField
            value={quantity}
            inputProps={{ readOnly: true }}
            style={{
              width: "80px",
              textAlign: "center",
              borderRadius: 0,
            }}
          />
          <IconButton onClick={handleIncrease} aria-label="increase quantity">
            <Add />
          </IconButton>
        </div>
        <button
          className={styles.addToCartButton}
          onClick={() => handleAddToCart(quantity)}
        >
          Add to Cart
        </button>
        <div className={styles.productDescriptionContainer}>
          <p className={styles.productDescriptionTitle}>Product Details:</p>
          <p className={styles.productDescription}>{rug.description}</p>
        </div>
        <Accordion style={{ boxShadow: "none", marginTop: "-1rem" }}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="product-care-content"
            id="product-care-header"
            style={{ padding: 0, borderBottom: "none" }}
          >
            <p style={{ margin: 0, color: "inherit", fontSize: "0.8rem" }}>
              Product Care Info
            </p>
          </AccordionSummary>
          <AccordionDetails>
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
      {/* 
      <div className={styles.relatedProducts}>
        <h2>Related Products</h2>
        <div className={styles.relatedProductsGrid}>
          {relatedProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className={styles.relatedProductItem}
            >
              <img
                src={product.imageUrls[0]}
                alt={product.name}
                className={styles.relatedProductImage}
              />
              <p>{product.name}</p>
              <p>${product.price.toFixed(2)} USD</p>
            </Link>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Product;
