// utils/api.js
import axios from "axios";

const BASE_URL = "https://localhost:7086";

// Interceptor برای افزودن Access Token به تمام درخواست‌ها
axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ۱. نمایش لیست مدارس
export const fetchSchools = async (filters) => {
  try {
    console.log(`فیلتر ها ${filters.level}`)
    const response = await axios.get(`${BASE_URL}/api/v1/admin/Schools`, { params: filters });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  }
};

// ۲. افزودن مدرسه جدید
export const addSchool = async (schoolData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/admin/Schools`, schoolData);
    return response.data;
  } catch (error) {
    console.error("Error adding school:", error);
    throw error;
  }
};

// ۳. مشاهده جزئیات مدرسه
export const getSchoolDetails = async (id) => {
  console.log(id)
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/admin/Schools/${id}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error getting school details:", error);
    throw error;
  }
};

// ۴. ویرایش مدرسه
export const updateSchool = async (schoolId, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/v1/admin/Schools/${schoolId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating school:", error);
    throw error;
  }
};

// ۵. حذف مدرسه
export const deleteSchool = async (schoolId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/v1/admin/Schools/${schoolId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting school:", error);
    throw error;
  }
};






export const apiLogout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("Refresh token not found");

    await axios.post(`${BASE_URL}/api/v1/admin/Auth/logout`, { refreshToken });
    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    
    window.location.href = "/login";
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};