const axios = require("axios");

const testApi = async () => {
  try {
    const response = await axios.get("/api/items");
    console.log("API Response:", response.data);
  } catch (error) {
    console.error("Error testing API:", error);
  }
};

module.exports = { testApi };
