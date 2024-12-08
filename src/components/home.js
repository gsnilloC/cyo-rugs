import React from "react";
import styles from "../styles/homepage.module.css";
import { Link } from "react-router-dom";
import {
  cus1Image,
  cus2Image,
  cus3Image,
  cus4Image,
  cus5Image,
  cus6Image,
  kobeImage,
  troupe,
  blondImage2,
  quasi,
} from "../assets/images";
import videoSource from "../assets/images/cyo-rugs-intro.mp4";
import useHome from "../hooks/useHome";
import LearnMoreButton from "./learnMoreButton";

function Home() {
  const { scrollContainerRef } = useHome();

  const featuredRugs = [
    { id: 1, name: "Kobe Bryant", image: kobeImage },
    { id: 2, name: "Phantom Troupe", image: troupe },
    { id: 3, name: "Blond", image: blondImage2 },
    { id: 4, name: "Quasimoto", image: quasi },
  ];

  const customerPhotos = [
    { id: 1, image: cus1Image },
    { id: 2, image: cus2Image },
    { id: 3, image: cus3Image },
    { id: 4, image: cus4Image },
    { id: 5, image: cus5Image },
    { id: 6, image: cus6Image },
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
          <p>
            Create your own world by transforming your space with a CYO piece
            crafted from your imagination. From rugs and wall art to unique,
            rugged designs, we bring an extra touch of style and personality to
            your space.
          </p>
          <Link to="/shop" className={styles.seeMoreButton}>
            Shop Now
          </Link>
        </div>
      </div>
      <div className={styles.featuredCollection}>
        <h2>Featured Collection</h2>
        <div className={styles.rugScrollContainer} ref={scrollContainerRef}>
          <div className={styles.rugGrid}>
            {featuredRugs.map((rug) => (
              <div key={rug.id} className={styles.rugItem}>
                <img
                  src={rug.image}
                  alt={rug.name}
                  className={styles.featuredRugImage}
                />
                <p>{rug.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.scrollIndicator}></div>
      </div>
      <div className={styles.customSection}>
        <h2>Need a Custom?</h2>
        <p>Transform your ideas into reality with custom orders</p>
        <Link to="/request">
          <LearnMoreButton />
        </Link>
      </div>
      <div className={styles.happyCustomers}>
        <h2>Happy Customers</h2>
        <div className={styles.customerScrollContainer}>
          <div className={styles.customerPhotos}>
            {customerPhotos.map((photo) => (
              <img
                key={photo.id}
                src={photo.image}
                alt={`Happy Customer ${photo.id}`}
              />
            ))}
          </div>
        </div>
        <div className={styles.scrollIndicator}></div>
      </div>
    </div>
  );
}

export default Home;
