import React from "react";
import styles from "./Home.module.css";
import videoSource from "../images/cyo-rugs-intro.mp4"; // or use a GIF: "../images/cyo-rugs-intro.gif"
import phantomImage from "../images/phantom.JPG";
import offWhiteImage from "../images/off-white.JPG";
import lebronImage from "../images/lebron.JPG";
import arkyveImage from "../images/arkyve.JPG";
import { Link } from "react-router-dom";
import InstagramIcon from "@mui/icons-material/Instagram";
function Home() {
  const featuredRugs = [
    { id: 1, name: "Phantom Troupe", image: phantomImage, price: 299.99 },
    { id: 2, name: "Off-White", image: offWhiteImage, price: 249.99 },
    { id: 3, name: "Lebron James", image: lebronImage, price: 349.99 },
    { id: 4, name: "Arkyve", image: arkyveImage, price: 200.99 },
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
            Ex vis veri diceret, et est enim indoctum. Ei sed natum assueverit,
            enim tation placerat ad usu. Cu dico sint repudiandae per, et vel
            idque vidisse, mundi inermis id per. Eam fugit hendrerit ea, his
            populo albucius elaboraret at. Tation timeam ad duo, cu tation
            partem usu, eius ludus pro in.
          </p>
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
      <div className={styles.customSection}>
        <h2>Need a custom?</h2>
        <p>
          Transform your ideas into reality with custom orders, ranging from
          rugs and more
        </p>
        <Link to="/request" className={styles.learnMoreButton}>
          Learn More
        </Link>
      </div>
      <div className={styles.happyCustomers}>
        <h2>Happy Customers</h2>
        <div className={styles.customerPhotos}>
          {/* You can add customer photos here */}
          <img src="/path/to/customer1.jpg" alt="Happy Customer 1" />
          <img src="/path/to/customer2.jpg" alt="Happy Customer 2" />
          <img src="/path/to/customer3.jpg" alt="Happy Customer 3" />
          {/* Add more customer photos as needed */}
        </div>
      </div>
    </div>
  );
}

export default Home;
