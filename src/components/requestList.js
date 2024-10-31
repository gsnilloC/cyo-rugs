import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/requestList.module.css";

function RequestList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <div>
            <img
              src={order.imageUrl}
              alt={`Order ${index + 1}`}
              style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
            />
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default RequestList;
