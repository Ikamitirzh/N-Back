// utils/api.js
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchSchools = async (filters) => {
  try {
    const response = await axios.get(`${BASE_URL}/School`, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  }
};

export const addSchool = async (schoolData) => {
  try {
    const response = await axios.post(`${BASE_URL}/School`, schoolData);
    return response.data;
  } catch (error) {
    console.error("Error adding school:", error);
    throw error;
  }
};

export const updateSchool = async (schoolId, updatedData) => {
  try {
    const response = await axios.put(`<span class="math-inline">\{BASE\_URL\}/School/</span>{schoolId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating school:", error);
    throw error;
  }
};

export const deleteSchool = async (schoolId) => {
  try {
    const response = await axios.delete(`<span class="math-inline">\{BASE\_URL\}/School/</span>{schoolId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting school:", error);
    throw error;
  }
};

export const getSchoolDetails = async (schoolId) => {
  try {
    const response = await axios.get(`<span class="math-inline">\{BASE\_URL\}/School/</span>{schoolId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting school details:", error);
    throw error;
  }
};