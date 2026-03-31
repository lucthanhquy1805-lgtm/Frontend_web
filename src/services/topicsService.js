import axios from "axios";

const API_URL = "https://localhost:7047/api/Topics";

const getTopicsPageData = async () => {
  const response = await axios.get(`${API_URL}/page-data`);
  return response.data;
}
export default getTopicsPageData;