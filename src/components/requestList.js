import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Modal,
  Box,
  Select,
  MenuItem,
  Button,
  IconButton,
  Switch,
} from "@mui/material";
import styles from "../styles/requestList.module.css";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";

function RequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [nameToDelete, setNameToDelete] = useState("");
  const [selectedHomepageImages, setSelectedHomepageImages] = useState(
    Array(5).fill(null)
  );
  const [homepageImages, setHomepageImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    email: "",
    name: "",
    trackingNumber: "",
  });
  const [isClosedSignVisible, setIsClosedSignVisible] = useState(false);

  const fileInputRefs = useRef(
    Array(5)
      .fill()
      .map(() => React.createRef())
  );

  useEffect(() => {
    fetchRequests();
    const loadHomepageImages = async () => {
      try {
        const response = await axios.get("/api/homepage-images");
        setHomepageImages(response.data.imageUrls);
      } catch (error) {
        console.error("Error loading homepage images:", error);
      }
    };

    loadHomepageImages();
  }, []);

  useEffect(() => {
    const fetchRequestStatus = async () => {
      try {
        const response = await axios.get("/api/settings/requests-status");
        setIsClosedSignVisible(!response.data.is_requests_open);
      } catch (error) {
        console.error("Error fetching requests status:", error);
      }
    };

    fetchRequestStatus();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("/api/orders");
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
    } catch (error) {
      setError("Failed to fetch requests");
    } finally {
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
      await axios.post("/api/inventory/update-prices");
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

  const handleDeleteRequest = async (requestId) => {
    try {
      await axios.delete(`/api/orders/${requestId}`);
      fetchRequests(); // Refresh the list after deletion
    } catch (err) {
      console.error("Error deleting request:", err);
    }
  };

  const handleDeleteInventoryByName = async () => {
    try {
      const response = await axios.delete(
        `/api/inventory/by-name/${nameToDelete}`
      );
      alert(response.data.message);
      setIsDeleteModalOpen(false); // Close the modal after deleting
    } catch (error) {
      console.error("Error deleting inventory item by name:", error);
      alert("Failed to delete item.");
    }
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    const newImages = [...selectedHomepageImages];
    newImages[index] = file;
    setSelectedHomepageImages(newImages);
  };

  const handleUploadToHomepage = async () => {
    const formData = new FormData();
    selectedHomepageImages.forEach((image, index) => {
      if (image) {
        formData.append("images", image); // Ensure this matches the expected field name
      }
    });
    try {
      const response = await axios.post(
        "/api/upload-homepage-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Images uploaded and replaced successfully:", response.data);
      setHomepageImages(response.data.images.map((img) => img.url));
      setIsModalOpen(false); // Close the modal after uploading
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...selectedHomepageImages];
    newImages[index] = null; // Set the selected image to null
    setSelectedHomepageImages(newImages);
  };

  const handleSendEmail = async (requestId) => {
    try {
      await axios.post(`/api/send-confirmation-email`, {
        ...emailData,
        requestId,
      });
      alert("Email sent successfully!");
      setIsEmailModalOpen(false);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };

  const handleEmailInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData({ ...emailData, [name]: value });
  };

  const toggleRequestsStatus = async () => {
    try {
      const newStatus = !isClosedSignVisible;
      await axios.patch("/api/settings/requests-status", {
        isOpen: !newStatus,
      });
      setIsClosedSignVisible(newStatus);
    } catch (error) {
      console.error("Error updating requests status:", error);
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
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setIsModalOpen(true)}
        >
          Select Images
        </Button>

        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className={styles.modal}
        >
          <Box className={styles.modalContent}>
            <div className={styles.previewContainer}>
              {selectedHomepageImages.map((file, index) => (
                <div
                  key={index}
                  className={styles.imageSlot}
                  onClick={() => fileInputRefs.current[index].current.click()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e)}
                    ref={fileInputRefs.current[index]}
                    style={{ display: "none" }}
                  />
                  {file ? (
                    <div style={{ position: "relative" }}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className={styles.previewImage}
                      />
                      <IconButton
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          color: "red",
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the file input
                          handleRemoveImage(index);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ) : (
                    <DownloadIcon />
                  )}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Button
                className={styles.setButton}
                onClick={handleUploadToHomepage}
              >
                Set New Homepage Images
              </Button>
            </div>
          </Box>
        </Modal>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete Item
        </Button>

        <Modal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          className={styles.modal}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 400 },
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              p: 4,
            }}
          >
            <input
              type="text"
              placeholder="Enter item name to delete"
              value={nameToDelete}
              onChange={(e) => setNameToDelete(e.target.value)}
              className={styles.nameInput}
            />
            <Button
              onClick={handleDeleteInventoryByName}
              className={styles.deleteButton}
            >
              Delete
            </Button>
          </Box>
        </Modal>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setIsEmailModalOpen(true)}
        >
          SEND EMAIL
        </Button>
        <Switch
          checked={isClosedSignVisible}
          onChange={toggleRequestsStatus}
          color="primary"
        />
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
                  {request.image_urls && request.image_urls.length > 0 ? (
                    request.image_urls.map((url, index) => (
                      <div key={index}>
                        <img
                          src={url}
                          alt={`Request ${index + 1}`}
                          className={styles.image}
                          onClick={() => setSelectedImage(url)}
                          onError={(e) => {
                            e.target.src = "fallback-image-url.jpg"; // Add a fallback image URL
                            e.target.onerror = null; // Prevent infinite loop
                          }}
                        />
                        <p>
                          {homepageImages && homepageImages[index]?.name
                            ? homepageImages[index].name
                            : `Image ${index + 1}`}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noImages}>No images available</div>
                  )}
                </div>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteRequest(request.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>
      <Modal
        open={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        className={styles.modal}
      >
        <Box className={styles.modalContent}>
          <h2>Send Confirmation Email</h2>
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={emailData.name}
            onChange={handleEmailInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Customer Email"
            value={emailData.email}
            onChange={handleEmailInputChange}
            required
          />
          <input
            type="text"
            name="trackingNumber"
            placeholder="Tracking Number"
            value={emailData.trackingNumber}
            onChange={handleEmailInputChange}
            required
          />
          <Button onClick={() => handleSendEmail(requests)}>Send Email</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default RequestList;
