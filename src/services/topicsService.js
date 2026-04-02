import axios from "axios";

const TOPICS_API_URL = "https://localhost:7047/api/Topics";
const CATEGORIES_API_URL = "https://localhost:7047/api/Categories";

export const getTopicsPageData = async () => {
  try {
    const response = await axios.get(`${TOPICS_API_URL}/page-data`);
    return response.data;
  } catch (error) {
    console.error("Error fetching topics page data:", error);
    throw error;
  }
};

export const createTopic = async (topicData) => {
  try {
    const response = await axios.post(TOPICS_API_URL, topicData);
    return response.data;
  } catch (error) {
    console.error("Error creating topic:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${CATEGORIES_API_URL}/page-data`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
export const updateTopic = async (id, topicData) => {
  try {
    const response = await axios.put(`${TOPICS_API_URL}/${id}`, topicData);
    return response.data;
  } catch (error) {
    console.error("Error updating topic:", error);
    throw error;
  }
};

export const deleteTopic = async (id) => {
  try {
    const response = await axios.delete(`${TOPICS_API_URL}/${id}`);
    return response.data;
  } catch (err) {
  console.error("Delete topic error:", err);
  console.log("Delete topic response:", err?.response?.data);

  alert(
    err?.response?.data?.message ||
    err?.response?.data?.title ||
    JSON.stringify(err?.response?.data) ||
    "Failed to delete topic."
  );
} finally {
  setDeleteLoadingId(null);
}
};
