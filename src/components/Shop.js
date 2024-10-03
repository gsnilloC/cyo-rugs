import React from "react";
import styles from "../styles/Shop.module.css";
import {
  phantomImage,
  offWhiteImage,
  lebronImage,
  arkyveImage,
  balloonImage,
  blondImage,
  cdgImage,
  kobeImage,
  squirtleImage,
  stardewImage,
  unoImage,
  zazaImage,
} from "../assets/images";

function Shop() {
  const rugs = [
    {
      id: 1,
      name: "Phantom Troupe",
      image: phantomImage,
      price: 299.99,
    },
    {
      id: 2,
      name: "Off-White",
      image: offWhiteImage,
      price: 199.99,
    },
    {
      id: 3,
      name: "Lebron James",
      image: lebronImage,
      price: 349.99,
    },
    {
      id: 4,
      name: "Arkyve",
      image: arkyveImage,
      price: 200.99,
    },
    {
      id: 5,
      name: "Balloon",
      image: balloonImage,
      price: 150.99,
    },
    {
      id: 6,
      name: "Blond",
      image: blondImage,
      price: 180.99,
    },
    {
      id: 7,
      name: "CDG",
      image: cdgImage,
      price: 220.99,
    },
    {
      id: 8,
      name: "Kobe",
      image: kobeImage,
      price: 250.99,
    },
    {
      id: 9,
      name: "Squirtle",
      image: squirtleImage,
      price: 190.99,
    },
    {
      id: 10,
      name: "Stardew",
      image: stardewImage,
      price: 120.99,
    },
    {
      id: 11,
      name: "Uno",
      image: unoImage,
      price: 100.99,
    },
    {
      id: 12,
      name: "Zaza",
      image: zazaImage,
      price: 130.99,
    },
  ];

  const addToCart = (rugId) => {
    console.log(`Added rug with id ${rugId} to cart`);
  };

  return (
    <div>
      <h1 className={styles.shopTitle}>Rugs</h1>
      <div className={styles.shopContainer}>
        <div className={styles.rugGrid}>
          {rugs.map((rug) => (
            <div key={rug.id} className={styles.rugItem}>
              <img src={rug.image} alt={rug.name} className={styles.rugImage} />
              <div className={styles.rugInfo}>
                <h2 className={styles.rugName}>{rug.name}</h2>
                <p className={styles.rugPrice}>${rug.price.toFixed(2)}</p>
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
      </div>
    </div>
  );
}

export default Shop;
