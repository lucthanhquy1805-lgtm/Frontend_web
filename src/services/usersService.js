import axios from "axios";

const API_URL = "https://localhost:7047/api/Users";

const getUserPageData = async () => {
  const response = await axios.get(`${API_URL}/page-data`);
  return response.data;
};

export default getUserPageData;