import axios from "axios";

const API_BASE_URL = "https://localhost:7047/api/Reports";

const getReportsSummary = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/summary`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports summary:", error);
    throw error;
  }
};

export default getReportsSummary;