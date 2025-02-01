import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../components/cartContext";
// import mockProducts from "../mocks/mockProducts";
import { toast } from "react-toastify";

const useProduct = () => {
  const { id } = useParams();
  const [rug, setRug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    const fetchRug = async () => {
      try {
        const response = await axios.get(`/api/items/${id}`);
        console.log("Fetched Rug Data:", response.data);
        setRug(response.data);
        if (response.data.v_names && response.data.v_names.length > 0) {
          setSelectedColor(response.data.v_names[0]);
        }
      } catch (err) {
        console.error("Error fetching rug:", err);
        setError(err);
      } finally {
        setLoading(false);
      }

      // try {
      //   // Use a mock product instead of fetching from the API
      //   const mockRug = mockProducts.find(
      //     (product) => product.id === parseInt(id)
      //   );
      //   if (mockRug) {
      //     setRug(mockRug);
      //   } else {
      //     throw new Error("Product not found in mock data");
      //   }
      // } catch (err) {
      //   console.error("Error fetching rug:", err);
      //   setError(err);
      // } finally {
      //   setLoading(false);
      // }
    };

    fetchRug();
  }, [id]);

  const handleIncrease = () => {
    const variationIndex = rug.v_names.findIndex(
      (name) => name === selectedColor
    );
    const availableStock = rug.v_quantities[variationIndex];

    if (quantity < availableStock) {
      setQuantity(quantity + 1);
    } else {
      toast.info("That's the MAX!");
    }
  };

  const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleAddToCart = (quantity, selectedColor) => {
    if (rug) {
      // Find the variation ID that matches the selected color
      const variationIndex = rug.v_names.findIndex(
        (name) => name === selectedColor
      );
      const variationId = rug.v_ids[variationIndex];

      const cartItemId = `${rug.id}-${selectedColor.toLowerCase()}`;
      addToCart({
        ...rug,
        id: cartItemId,
        quantity,
        selectedColor,
        variationId, // Add this to track the Square variation ID
      });
    }
  };

  return {
    rug,
    loading,
    error,
    quantity,
    selectedColor,
    handleIncrease,
    handleDecrease,
    handleAddToCart,
  };
};

export default useProduct;
