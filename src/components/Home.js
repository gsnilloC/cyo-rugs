import React from "react";
import styles from "./Home.module.css";
import logoImage from "../images/logo.JPG"; // Assuming you have a logo image
import phantomImage from "../images/phantom.JPG";
import offWhiteImage from "../images/off-white.JPG";
import lebronImage from "../images/lebron.JPG";
import arkyveImage from "../images/arkyve.JPG";
// Import other featured rug images as needed

function Home() {
  const featuredRugs = [
    { id: 1, name: "Phantom Troupe", image: phantomImage },
    { id: 2, name: "Off-White", image: offWhiteImage },
    { id: 3, name: "Lebron James", image: lebronImage },
    { id: 4, name: "Arkyve", image: arkyveImage },
  ];

  return (
    <div className={styles.homeContainer}>
      <img src={logoImage} alt="CYO Rugs Logo" className={styles.logo} />
      <section className={styles.featuredRugs}>
        {featuredRugs.map((rug) => (
          <div key={rug.id} className={styles.rugItem}>
            <img src={rug.image} alt={rug.name} className={styles.rugImage} />
            <h2 className={styles.rugName}>{rug.name}</h2>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Home;
