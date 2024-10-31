import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/requestList.module.css";

function RequestList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders");
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          throw new Error("Response is not an array");
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching orders: {error.message}</div>;
  }

  return (
    <div className={styles.requestListContainer}>
      <h1>Order Requests</h1>
      {orders.map((order, index) => (
        <div key={index} className={styles.orderItem}>
          <p>Name: {order.name}</p>
          <p>Phone: {order.phone}</p>
          <p>Email: {order.email}</p>
          <p>Description: {order.description}</p>
          <div className={styles.imageContainer}>
            {order.imageUrls.map((imageUrl, imgIndex) => (
              <img
                key={imgIndex}
                src={imageUrl}
                alt={`Order ${imgIndex + 1}`}
                onClick={() => openModal(imageUrl)}
              />
            ))}
          </div>
          <hr />
        </div>
      ))}

      {selectedImage && (
        <div className={styles.modal} onClick={closeModal}>
          <span className={styles.close} onClick={closeModal}>
            &times;
          </span>
          <img src={selectedImage} alt="Enlarged" />
        </div>
      )}
    </div>
  );
}

export default RequestList;
