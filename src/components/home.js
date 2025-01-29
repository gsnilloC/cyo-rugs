import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/homepage.module.css";
import { Link } from "react-router-dom";
import { cus1Image, cus4Image, phantom, ig1, ig2, ig3 } from "../assets/images";
import videoSource from "../assets/images/cyo-rugs-introv2.mp4";
import useHome from "../hooks/useHome";
import LearnMoreButton from "./learnMoreButton";
import PasswordModal from "./PasswordModal";

function Home() {
  const { scrollContainerRef } = useHome();
  const [homepageImages, setHomepageImages] = useState([]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true);

  useEffect(() => {
    const fetchHomepageImages = async () => {
      try {
        const response = await axios.get("/api/homepage-images");
        setHomepageImages(response.data.imageUrls);
      } catch (error) {
        console.error("Error fetching homepage images:", error);
      }
    };

    fetchHomepageImages();
  }, []);

  const featuredRugs = [
    // { id: 1, name: "Ganger", image: ganger },
    // { id: 2, name: "Akira", image: akira },
    // { id: 3, name: "Boo", image: boo },
    ...homepageImages.map((url, index) => ({
      id: `homepage-${index}`,
      name: `Homepage Image ${index + 1}`,
      image: url,
    })),
  ];

  const customerPhotos = [
    { id: 1, image: cus1Image },
    { id: 2, image: cus4Image },
    { id: 3, image: phantom },
    { id: 4, image: ig1 },
    { id: 5, image: ig2 },
    { id: 6, image: ig3 },
  ];

  return (
    <div className={styles.homeContainer}>
      {/* <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      /> */}
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
            rugged designs, bring an extra touch of style and personality to
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
                {/* <p>{rug.name}</p> */}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.scrollIndicator}></div>
      </div>
      <div className={styles.customSection}>
        <h2>Create a 1 of 1</h2>
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
