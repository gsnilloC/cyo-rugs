import { useEffect, useState } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 9;

const useShop = () => {
  const [rugs, setRugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchRugs = async () => {
      try {
        const response = await axios.get("/api/items");
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
          const rugsWithInventory = response.data.map((rug) => {
            const totalInventory = Array.isArray(rug.v_quantities)
              ? rug.v_quantities.reduce(
                  (sum, qty) => sum + (Number(qty) || 0),
                  0
                )
              : 0;

            return {
              ...rug,
              inventoryCount: totalInventory,
            };
          });

          rugsWithInventory.sort((a, b) => a.name.localeCompare(b.name));
          console.log(
            "Final processed rugs:",
            rugsWithInventory.map((rug) => ({
              name: rug.name,
              inventoryCount: rug.inventoryCount,
            }))
          );

          setRugs(rugsWithInventory);
        }
      } catch (err) {
        console.error("Error fetching rugs:", err);
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
