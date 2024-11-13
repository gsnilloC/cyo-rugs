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
        if (Array.isArray(response.data)) {
          const rugsWithInventory = await Promise.all(
            response.data.map(async (rug) => {
              const inventoryResponse = await axios.get(`/api/inventory/${rug.id}`);
              return { ...rug, inventoryCount: inventoryResponse.data.inventoryCount };
            })
          );
          setRugs(rugsWithInventory);
        } else {
          throw new Error("Response is not an array");
        }
      } catch (err) {
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
