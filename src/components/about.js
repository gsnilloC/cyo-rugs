import React from "react";
import styles from "../styles/about.module.css";

function About() {
  return (
    <div className={styles.aboutContainer}>
      <h1>FAQ</h1>

      <section className={styles.instructions}>
        <h2>Delivery Information</h2>
        <ul>
          <li>All orders are final</li>
          <li>Main page orders: 2-3 weeks delivery</li>
          <li>Custom page orders: 3-4 weeks delivery</li>
        </ul>
      </section>

      <section className={styles.aboutArtist}>
        <h2>Refund Policy</h2>
        <p>
          Refund Policy - All sales are final unless there is a proven
          discrepancy found on our end.
        </p>
      </section>

      <section className={styles.contact}>
        <h2>Contact Us</h2>
        <p>
          Follow us on Instagram:{" "}
          <a
            href="https://www.instagram.com/cyorugs"
            target="_blank"
            rel="noopener noreferrer"
          >
            @cyorugs
          </a>
        </p>
        <p>
          Email:{" "}
          <a
            href="https://www.instagram.com/cyorugs"
            target="_blank"
            rel="noopener noreferrer"
          >
            cyorugs@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}

export default About;
