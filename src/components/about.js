import React from "react";
import styles from "../styles/about.module.css";

function About() {
  return (
    <div className={styles.aboutContainer}>
      <h1>About</h1>

      <section className={styles.instructions}>
        <h2>Delivery Information</h2>
        <h4>Main Page orders</h4>
        <ul>
          <li>2-3 weeks delivery</li>
          <li>Free Shipping</li>
        </ul>
        <h4>Custom Page orders</h4>
        <ul>
          <li>3-4 weeks delivery (4+ weeks depending on design)</li>
        <li>Will be quoted before rug is created.</li>
          <li>
            Shipping price will be calculated after the rug is made and weighed
            for shipment.
          </li>
          <li>
            If high volume of orders are resulting in shipments being delayed,
            you will be contacted via email.
          </li>
        </ul>

        <h2>Refund Policy</h2>
        <p>
          All Sales Final! Refunds and exchanges are not accepted at this time.
        </p>

        <h2>Damage</h2>
        <p>
          All products are carefully packaged taking into account all the risks
          for breakage or deterioration while in transit. CYO Rugs is not liable
          for any products damaged or lost during shipping. If you received your
          order damaged, please contact the shipping provider within 24 hours
          with photos including the exterior and interior packaging, the
          shipping label, and the damaged item to file an insurance claim.
        </p>

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
