import { useEffect, useState } from "react";
import axios from "axios";

const useShop = () => {
  const [rugs, setRugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRugs = async () => {
      try {
        const response = await axios.get("/api/items");
        console.log("API Response:", response.data); // Log the response
        if (Array.isArray(response.data)) {
          setRugs(response.data);
        } else {
          throw new Error("Response is not an array");
        }
      } catch (err) {
        console.error("Error fetching rugs:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRugs();
  }, []);

  return { rugs, loading, error };
};

export default useShop;
