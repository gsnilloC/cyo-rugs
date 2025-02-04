import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useRequestForm = () => {
  const [images, setImages] = useState([null, null, null]);
  const [showTip, setShowTip] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    description: "",
  });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosedSignVisible, setIsClosedSignVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);
  const submissionInterval = 60000; // 1 minute

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const newImages = [...images];
    for (let i = 0; i < files.length && i < 3; i++) {
      newImages[i] = files[i];
    }
    setImages(newImages);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleTipClick = () => {
    setShowTip(!showTip);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const cleaned = ("" + value).replace(/\D/g, "");
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

      if (match) {
        const formattedNumber = [match[1], match[2], match[3]]
          .filter(Boolean)
          .join("-");
        setFormData({ ...formData, [name]: formattedNumber });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentTime = Date.now();

    // Check if the user is trying to submit too quickly
    if (currentTime - lastSubmissionTime < submissionInterval) {
      toast.error("Please wait before submitting another request.");
      return;
    }

    setIsLoading(true);
    setLastSubmissionTime(currentTime); // Update the last submission time

    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.description
    ) {
      toast.error("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("recaptchaToken", recaptchaToken);

    images.forEach((image, index) => {
      if (image) {
        formDataToSend.append(`images`, image);
      }
    });

    try {
      const response = await axios.post("/api/upload", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Upload successful!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      toast.error("Error uploading form data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    images,
    showTip,
    formData,
    recaptchaToken,
    isModalOpen,
    isClosedSignVisible,
    isLoading,
    fileInputRef,
    setImages,
    setShowTip,
    setFormData,
    setRecaptchaToken,
    setIsModalOpen,
    setIsClosedSignVisible,
    setIsLoading,
    handleImageUpload,
    handleRemoveImage,
    handleTipClick,
    handleInputChange,
    handleSubmit,
    toggleRequestsStatus,
  };
};

export default useRequestForm;
