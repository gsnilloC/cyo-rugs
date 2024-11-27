import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Modal,
  Box,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import styles from "../styles/requestList.module.css";

function RequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("/api/orders");
      console.log(response.data);
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      const processedRequests = data.map((request) => ({
        id: request.id || Math.random().toString(),
        name: request.name || "No Name",
        phone: request.phone || "No Phone",
        email: request.email || "No Email",
        description: request.description || "No Description",
        image_urls: Array.isArray(request.image_urls) ? request.image_urls : [],
        status: request.status || "Received",
        created_at: request.created_at || new Date().toISOString(),
      }));

      setRequests(processedRequests);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching requests:", err);
      if (err.response && err.response.status === 404) {
        setError("No requests found.");
      } else {
        setError(err.message || "Failed to load requests");
      }
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await axios.patch(`/api/orders/${requestId}/status`, {
        status: newStatus,
      });
      fetchRequests(); // Refresh the list
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const updatePrices = async () => {
    try {
      await axios.post("/api/update-prices");
      alert("Prices updated successfully!");
    } catch (error) {
      console.error("Error updating prices:", error);
      alert("Failed to update prices.");
    }
  };

  const clearZeroQuantity = async () => {
    try {
      const response = await axios.delete("/api/inventory/cleanup");
      alert(response.data.message);
    } catch (error) {
      console.error("Error clearing zero quantity items:", error);
      alert("Failed to clear zero quantity items.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className={styles.buttonContainer}>
        <Button variant="contained" color="secondary" onClick={updatePrices}>
          Update Prices
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={clearZeroQuantity}
        >
          Clear Zero Quantity
        </Button>
      </div>
      <div className={styles.requestListContainer}>
        <Modal
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          className={styles.modal}
        >
          <Box className={styles.modal}>
            <button
              onClick={() => setSelectedImage(null)}
              className={styles.closeButton}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Enlarged"
              className={styles.modalImage}
            />
          </Box>
        </Modal>
        <div className={styles.requestTitle}>Custom Rug Requests</div>
        {error && <div>{error}</div>}
        {requests.length > 0 &&
          requests.map((request) => (
            <Card key={request.id} className={styles.orderItem}>
              <CardContent>
                <Select
                  value={request.status}
                  onChange={(e) =>
                    handleStatusChange(request.id, e.target.value)
                  }
                  className={styles.statusSelect}
                >
                  <MenuItem value="Received">Received</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Preparing for Shipping">
                    Preparing for Shipping
                  </MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </Select>
                <div className={styles.orderItemName}>{request.name}</div>
                <div className={styles.orderItemEmail}>{request.email}</div>
                <div className={styles.orderItemContact}>{request.phone}</div>
                <div className={styles.descriptionTextarea}>
                  {request.description}
                </div>
                <div className={styles.orderItemCreatedAt}>
                  Requested on: {formatDate(request.created_at)}
                </div>
                <div className={styles.imageContainer}>
                  {request.image_urls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Request ${index + 1}`}
                      className={styles.image}
                      onClick={() => setSelectedImage(url)}
                      onError={(e) => {
                        e.target.src = "fallback-image-url.jpg"; // Add a fallback image URL
                        e.target.onerror = null; // Prevent infinite loop
                      }}
                    />
                  ))}
                  {request.image_urls.length === 0 && (
                    <div className={styles.noImages}>No images available</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default RequestList;
