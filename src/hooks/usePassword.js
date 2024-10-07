import { useState } from "react";
import { useNavigate } from "react-router-dom";

const usePassword = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const correctPassword = "lookBOWHELLO";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      navigate("/home");
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  return {
    password,
    setPassword,
    handleSubmit,
  };
};

export default usePassword;
