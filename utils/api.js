// utils/api.js
import axios from "axios";
import { authApiClient } from "../hooks/useAuth";

const BASE_URL = "https://localhost:7086";

// ایجاد یک نمونه axios جداگانه برای درخواست‌های عمومی
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ==================== بخش مدیریتی (ادمین) ====================
// ۱. نمایش لیست مدارس
export const fetchSchools = async (filters) => {
  try {
    const response = await authApiClient.get(`${BASE_URL}/api/v1/admin/Schools`, { 
      params: filters 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  }
};

// ۲. افزودن مدرسه جدید
export const addSchool = async (schoolData) => {
  try {
    const response = await authApiClient.post(`${BASE_URL}/api/v1/admin/Schools`, schoolData);
    return response.data;
  } catch (error) {
    console.error("Error adding school:", error);
    throw error;
  }
};

// ۳. مشاهده جزئیات مدرسه
export const getSchoolDetails = async (id) => {
  try {
    const response = await authApiClient.get(`${BASE_URL}/api/v1/admin/Schools/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting school details:", error);
    throw error;
  }
};

// ۴. ویرایش مدرسه
export const updateSchool = async (schoolId, updatedData) => {
  try {
    const response = await authApiClient.put(`${BASE_URL}/api/v1/admin/Schools/${schoolId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating school:", error);
    throw error;
  }
};

// ۵. حذف مدرسه
export const deleteSchool = async (schoolId) => {
  try {
    const response = await authApiClient.delete(`${BASE_URL}/api/v1/admin/Schools/${schoolId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting school:", error);
    throw error;
  }
};

// ==================== توابع مشترک ====================
export const apiLogout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("Refresh token not found");

    await authApiClient.post(`${BASE_URL}/api/v1/Auth/logout`, { refreshToken });
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const getProvinceIdByName = async (provinceName) => {
  try {
    const response = await authApiClient.get(`${BASE_URL}/api/v1/admin/Provinces`, {
      params: { SearchTerm: provinceName },
    });
    
    if (response.data && response.data.length > 0) {
      const province = response.data.find(p => p.name === provinceName);
      return province ? province.id : null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return null;
  }
};

export const getCityIdByName = async (cityName, provinceId) => {
  try {
    const response = await authApiClient.get(`${BASE_URL}/api/v1/admin/Cities`, {
      params: { 
        SearchTerm: cityName,
        ProvinceId: provinceId 
      },
    });
    
    if (response.data && response.data.length > 0) {
      const city = response.data.find(c => c.name === cityName);
      return city ? city.id : null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return null;
  }
};

// ==================== بخش کاربران عادی ====================
export const fetchProvinces = async () => {
  try {
    const response = await publicApi.get("/api/v1/Provinces");
    return response.data.items || response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

export const fetchCities = async (provinceId) => {
  try {
    const response = await publicApi.get("/api/v1/Cities", {
      params: { parentId: provinceId },
    });
    return response.data.items || response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

export const fetchSchoolsUser = async (cityId) => {
  try {
    const response = await publicApi.get("/api/v1/Schools", {
      params: { parentId: cityId },
    });
    return response.data.items || response.data;
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  }
};