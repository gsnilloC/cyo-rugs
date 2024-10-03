import React, { useRef, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { Link } from "react-router-dom";
import {
  phantomImage,
  offWhiteImage,
  lebronImage,
  arkyveImage,
  cus1Image,
  cus2Image,
  cus3Image,
  cus4Image,
  cus5Image,
  cus6Image,
} from "../assets/images";
import videoSource from "../assets/images/cyo-rugs-intro.mp4";

function Home() {
  const featuredRugs = [
    { id: 1, name: "Phantom Troupe", image: phantomImage, price: 299.99 },
    { id: 2, name: "Off-White", image: offWhiteImage, price: 249.99 },
    { id: 3, name: "Lebron James", image: lebronImage, price: 349.99 },
    { id: 4, name: "Arkyve", image: arkyveImage, price: 200.99 },
  ];

  const customerPhotos = [
    { id: 1, image: cus1Image },
    { id: 2, image: cus2Image },
    { id: 3, image: cus3Image },
    { id: 4, image: cus4Image },
    { id: 5, image: cus5Image },
    { id: 6, image: cus6Image },
  ];

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    scrollContainer.addEventListener("mousedown", handleMouseDown);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);
    scrollContainer.addEventListener("mouseup", handleMouseUp);
    scrollContainer.addEventListener("mousemove", handleMouseMove);

    return () => {
      scrollContainer.removeEventListener("mousedown", handleMouseDown);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      scrollContainer.removeEventListener("mouseup", handleMouseUp);
      scrollContainer.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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
            Ex vis veri diceret, et est enim indoctum. Ei sed natum assueverit,
            enim tation placerat ad usu. Cu dico sint repudiandae per, et vel
            idque vidisse, mundi inermis id per. Eam fugit hendrerit ea, his
            populo albucius elaboraret at. Tation timeam ad duo, cu tation
            partem usu, eius ludus pro in.
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
      <div className={styles.customSection}>
        <h2>Need a Custom?</h2>
        <p>Transform your ideas into reality with custom orders</p>
        <Link to="/request" className={styles.seeMoreButton}>
          Learn More
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
