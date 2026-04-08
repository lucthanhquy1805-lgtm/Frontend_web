import axios from "axios";

const API_URL = "https://localhost:7047/api/Users";

export const getUserPageData = async () => {
  const response = await axios.get(`${API_URL}/page-data`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(API_URL, userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axios.put(`${API_URL}/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const DEPT_API_URL = "https://localhost:7047/api/Departments";

export const getDepartments = async () => {
  const response = await axios.get(DEPT_API_URL);
  return response.data;
};