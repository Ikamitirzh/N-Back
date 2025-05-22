// hooks/useAuth.js
import { useState, useEffect } from "react";
import axios from "axios";
import { apiLogout } from "../utils/api";

const BASE_URL = "https://localhost:7086";
const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin', 'principal', 'student'

  // Load tokens from localStorage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem(TOKEN_KEY);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedRole = localStorage.getItem("userRole");

    if (storedAccessToken && storedRefreshToken && storedRole) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUserRole(storedRole);
      setUser({ username: "LoggedUser" });
    }
  }, []);

  // ==================== توابع مشترک ====================
  const logout = async () => {
    try {
      await apiLogout();
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem("userRole");
      setAccessToken("");
      setRefreshToken("");
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // ==================== بخش ادمین ====================
  const adminLogin = async (username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/admin/Auth/login`, {
        userName: username,
        password: password,
      });

      const { accessToken, refreshToken } = response.data;

      storeTokens(accessToken, refreshToken, "admin");
      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Error in admin login:", error);
      throw error;
    }
  };

  // ==================== بخش مدیران ====================
  const sendOtp = async (phoneNumber) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/school-principal/Auth/send-otp`,
        { phoneNumber }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  };

  const verifyOtp = async (phoneNumber, otpCode) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/school-principal/Auth/verify-otp`,
        { phoneNumber, otpCode }
      );
      
      const { token, isFirstLogin } = response.data;
      storeTokens(token.accessToken, token.refreshToken, "principal");
      setIsFirstLogin(isFirstLogin);
      return { isFirstLogin };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };

  // ==================== بخش کاربران عادی ====================
  const studentLogin = async (studentData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/Auth`,
        {
          phoneNumber: studentData.phoneNumber,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          age: parseInt(studentData.age),
          gender: parseInt(studentData.gender),
          isRightHanded: studentData.isRightHanded === 'true',
          schoolId: studentData.schoolId ? parseInt(studentData.schoolId) : 0
        }
      );

      const { accessToken, refreshToken } = response.data;
      storeTokens(accessToken, refreshToken, "student");
      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Error in student login:", error);
      throw error;
    }
  };

  // ==================== توابع کمکی ====================
  const storeTokens = (accessToken, refreshToken, role) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem("userRole", role);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserRole(role);
  };

  const refreshAccessToken = async () => {
    try {
      let endpoint;
      
      // انتخاب اندپوینت مناسب بر اساس نقش کاربر
      switch(userRole) {
        case 'admin':
          endpoint = '/api/v1/admin/Auth/refresh-token';
          break;
        case 'principal':
          endpoint = '/api/v1/school-principal/Auth/refresh-token';
          break;
        case 'student':
          endpoint = '/api/v1/Auth/refresh-token';
          break;
        default:
          throw new Error('نقش کاربر نامعتبر است');
      }

      const response = await axios.post(
        `${BASE_URL}${endpoint}`,
        { refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const newAccessToken = response.data.accessToken;
      localStorage.setItem(TOKEN_KEY, newAccessToken);
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
      throw error;
    }
  };

  // Interceptor برای مدیریت توکن منقضی شده
  const setupAxiosInterceptor = (axiosInstance) => {
    // اضافه کردن توکن به تمام درخواست‌ها
    axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // مدیریت خطای 401
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const newAccessToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  };


  return {
    user,
    accessToken,
    refreshToken,
    isFirstLogin,
    userRole,
    
    // Admin functions
    adminLogin,
    
    // Principal functions
    sendOtp,
    verifyOtp,
    
    // Student functions
    studentLogin,
    
    // Common functions
    logout,
    refreshAccessToken,
     apiClient, // اضافه کردن apiClient به خروجی هوک
    setupAxiosInterceptor
  };
};