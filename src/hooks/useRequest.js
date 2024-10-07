import { useState } from "react";

const useRequest = () => {
  const [rugImage, setRugImage] = useState(null);
  const [wallImage, setWallImage] = useState(null);

  const handleRugUpload = (event) => {
    const file = event.target.files[0];
    setRugImage(URL.createObjectURL(file));
  };

  const handleWallUpload = (event) => {
    const file = event.target.files[0];
    setWallImage(URL.createObjectURL(file));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");
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
