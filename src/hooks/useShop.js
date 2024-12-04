import { useEffect, useState } from "react";
import axios from "axios";
import mockProducts from "../mocks/mockProducts";

const ITEMS_PER_PAGE = 6;

const useShop = () => {
  const [rugs, setRugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchRugs = async () => {
      try {
        // Fetching from the API
        const response = await axios.get("/api/items");
        if (Array.isArray(response.data)) {
          const rugsWithInventory = await Promise.all(
            response.data.map(async (rug) => {
              const inventoryResponse = await axios.get(
                `/api/inventory/${rug.id}`
              );
              return {
                ...rug,
                inventoryCount: inventoryResponse.data.inventoryCount,
              };
            })
          );
          rugsWithInventory.sort((a, b) => a.name.localeCompare(b.name));
          setRugs(rugsWithInventory);
        } else {
          throw new Error("Response is not an array");
        }

        // //Use mock products instead
        // setRugs(mockProducts);
      } catch (err) {
        console.error("Error fetching rugs from API, using mock data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRugs();
  }, []);

  const totalPages = Math.ceil(rugs.length / ITEMS_PER_PAGE);
  const paginatedRugs = rugs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
    paginatedRugs,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};

export default useShop;
