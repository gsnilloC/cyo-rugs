import { useState } from "react";
import axios from "axios";

const useRequest = () => {
  const [rugImage, setRugImage] = useState(null);
  const [wallImage, setWallImage] = useState(null);

  const handleRugUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setRugImage(file);
    }
  };

  const handleWallUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setWallImage(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    if (rugImage) {
      const rugFile = rugImage;
      formData.append("image", rugFile);
    }
    if (wallImage) {
      const wallFile = wallImage;
      formData.append("image", wallFile);
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
