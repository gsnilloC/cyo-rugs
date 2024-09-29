import React from "react";
import styles from "../styles/About.module.css";

function About() {
  return (
    <div className={styles.aboutContainer}>
      <h1>About Us</h1>

      <section className={styles.aboutArtist}>
        <h2>About the Artist</h2>
        <p>
          [Insert information about the artist here. This could include their
          background, inspiration, and passion for creating custom rugs.]
        </p>
      </section>

      <section className={styles.instructions}>
        <h2>Delivery Information</h2>
        <ul>
          <li>All orders are final</li>
          <li>Main page orders: 2-3 weeks delivery</li>
          <li>Custom page orders: 3-4 weeks delivery</li>
          <p>
            [Insert any additional delivery information here, such as shipping
            methods, tracking, or special handling instructions.]
          </p>
        </ul>
      </section>

      <section className={styles.rugCare}>
        <h2>Rug Care</h2>
        <ul>
          <li>Heavy foot traffic area: Vacuum whenever you use vacuum</li>
          <li>Regular foot traffic: Vacuum biweekly</li>
          <li>Wall art: Vacuum biweekly (ideally hand held)</li>
        </ul>
      </section>
    </div>
  );
}

export default About;
