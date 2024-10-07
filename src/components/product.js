import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../styles/product.module.css";
import { useCart } from "./cartContext"; // Import the useCart hook

const Product = () => {
  const { id } = useParams(); // Get the rug ID from the URL
  const [rug, setRug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart(); // Get addToCart function from context

  useEffect(() => {
    const fetchRug = async () => {
      try {
        const response = await axios.get(`/api/items/${id}`); // Fetch rug details
        setRug(response.data);
      } catch (err) {
        console.error("Error fetching rug:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRug();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching item: {error.message}</div>;
  }

  if (!rug) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    addToCart(rug); // Add the rug to the cart
  };

  return (
    <div className={styles.productContainer}>
      <img
        src={rug.imageUrls[0]}
        alt={rug.name}
        className={styles.productImage}
      />
      <div className={styles.productDetails}>
        <h1>{rug.name}</h1>
        <p className={styles.productPrice}>${rug.price.toFixed(2)} USD</p>
        <p className={styles.productDescription}>{rug.description}</p>
        <div className={styles.quantityContainer}>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            defaultValue="1"
          />
        </div>
        <button className={styles.addToCartButton} onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Product;
