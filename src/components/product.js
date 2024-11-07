import React, { useState } from "react";
import styles from "../styles/product.module.css";
import useProduct from "../hooks/useProduct";
// import mockProducts from "../mocks/mockProducts";

const Product = () => {
  const { rug, loading, error, handleAddToCart } = useProduct();
  const [quantity, setQuantity] = useState(1);

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
        <p className={styles.productDescription}>{rug.description}</p>
        <div className={styles.quantityContainer}>
          <button onClick={handleDecrease}>-</button>
          <input type="number" id="quantity" value={quantity} readOnly />
          <button onClick={handleIncrease}>+</button>
        </div>
        <button className={styles.addToCartButton} onClick={() => handleAddToCart(quantity)}>Add to Cart</button>
      </div>
    </div>
  );
};

export default Product;
