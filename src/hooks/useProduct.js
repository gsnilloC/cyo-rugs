import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../components/cartContext";

const useProduct = () => {
  const { id } = useParams();
  const [rug, setRug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchRug = async () => {
      try {
        const response = await axios.get(`/api/items/${id}`);
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
    addToCart(rug);
  };

  return { rug, loading, error, handleAddToCart };
};

export default useProduct;
