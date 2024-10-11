import { useState } from "react";
import axios from "axios";

const useRequest = () => {
  const [rugImage, setRugImage] = useState(null);
  const [wallImage, setWallImage] = useState(null);

  const handleRugUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setRugImage(file); // Store the actual file
    }
  };

  const handleWallUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setWallImage(file); // Store the actual file
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    if (rugImage) {
      const rugFile = rugImage; // Use the actual file
      formData.append("image", rugFile); // Append the rug image
    }
    if (wallImage) {
      const wallFile = wallImage; // Use the actual file
      formData.append("image", wallFile); // Append the wall image
    }

    try {
      const response = await axios.post("api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return {
    rugImage,
    wallImage,
    handleRugUpload,
    handleWallUpload,
    handleSubmit,
    setRugImage,
    setWallImage,
  };
};

export default useRequest;
