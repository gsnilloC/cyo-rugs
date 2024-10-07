import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../components/cartContext"; // Adjust the import path as necessary

const useProduct = () => {
  const { id } = useParams(); // Get the rug ID from the URL
  const [rug, setRug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart(); // Get addToCart function from context

  useEffect(() => {
    const fetchRug = async () => {
      try {
        const response = await axios.get(`/api/items/${id}`); // Fetch rug details
        setRug(response.data);
      } catch (err) {
        console.error("Error fetching rug:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRug();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(rug); // Add the rug to the cart
  };

  return { rug, loading, error, handleAddToCart };
};

export default useProduct;
