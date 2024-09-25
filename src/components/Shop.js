import React from "react";
import styles from "./Shop.module.css";
import phantomImage from "../images/phantom.JPG";
import offWhiteImage from "../images/off-white.JPG";
// Import other rug images as needed

function Shop() {
  const rugs = [
    {
      id: 1,
      name: "Phantom Troupe",
      image: phantomImage,
      price: 299.99,
      description: "A vibrant, colorful rug with intricate patterns.",
    },
    {
      id: 2,
      name: "Off-White",
      image: offWhiteImage,
      price: 199.99,
      description: "A sleek, simple design perfect for contemporary spaces.",
    },
    // Add more rugs as needed, importing and using their respective images
  ];

  const addToCart = (rugId) => {
    // Implement add to cart functionality
    console.log(`Added rug with id ${rugId} to cart`);
  };

  return (
    <div className={styles.shopContainer}>
      {rugs.map((rug) => (
        <div key={rug.id} className={styles.rugItem}>
          <img src={rug.image} alt={rug.name} className={styles.rugImage} />
          <div className={styles.rugInfo}>
            <h2 className={styles.rugName}>{rug.name}</h2>
            <p className={styles.rugPrice}>${rug.price.toFixed(2)}</p>
            <p>{rug.description}</p>
            <button
              className={styles.addToCartButton}
              onClick={() => addToCart(rug.id)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Shop;
