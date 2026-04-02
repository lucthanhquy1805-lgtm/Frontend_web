import axios from "axios";

const API_URL = "https://localhost:7047/api/Topics";

export const getTopicsPageData = async () => {
  const response = await axios.get(`${API_URL}/page-data`);
  return response.data;
};

export const createTopic = async (topicData) => {
  const response = await axios.post(API_URL, topicData);
  return response.data;
};

export const updateTopic = async (id, topicData) => {
  const response = await axios.put(`${API_URL}/${id}`, topicData);
  return response.data;
};

export const deleteTopic = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};