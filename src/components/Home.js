import React from "react";
import styles from "./Home.module.css";
import videoSource from "../images/cyo-rugs-intro.mp4"; // or use a GIF: "../images/cyo-rugs-intro.gif"
import phantomImage from "../images/phantom.JPG";
import offWhiteImage from "../images/off-white.JPG";
import lebronImage from "../images/lebron.JPG";

function Home() {
  const featuredRugs = [
    { id: 1, name: "Phantom Troupe", image: phantomImage, price: 299.99 },
    { id: 2, name: "Off-White", image: offWhiteImage, price: 249.99 },
    { id: 3, name: "Lebron James", image: lebronImage, price: 349.99 },
  ];

  return (
    <div className={styles.homeContainer}>
      <div className={styles.introSection}>
        <div className={styles.videoContainer}>
          <video autoPlay loop muted playsInline className={styles.video}>
            <source src={videoSource} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={styles.textContainer}>
          <h1>Welcome to CYO Rugs</h1>
          <p>Create your own cool unique one of a kind rug today!</p>
        </div>
      </div>
      <div className={styles.featuredCollection}>
        <h2>Featured Collection</h2>
        <div className={styles.rugScrollContainer}>
          <div className={styles.rugGrid}>
            {featuredRugs.map((rug) => (
              <div key={rug.id} className={styles.rugItem}>
                <img
                  src={rug.image}
                  alt={rug.name}
                  className={styles.rugImage}
                />
                <h3>{rug.name}</h3>
                <p>${rug.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.scrollIndicator}></div>
      </div>
    </div>
  );
}

export default Home;
