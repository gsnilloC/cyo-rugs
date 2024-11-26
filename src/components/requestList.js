import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Button,
  Modal,
  Box,
  Select,
  MenuItem,
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
      setError(err.message || "Failed to load requests");
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!Array.isArray(requests) || requests.length === 0)
    return <div>No requests found</div>;

  return (
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
      {requests.map((request) => (
        <Card key={request.id} className={styles.orderItem}>
          <CardContent>
            <Select
              value={request.status}
              onChange={(e) => handleStatusChange(request.id, e.target.value)}
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
  );
}

export default RequestList;
