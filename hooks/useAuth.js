// hooks/useAuth.js
import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://localhost:7086";
const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_ROLE_KEY = "userRole";

// ایجاد یک نمونه axios مخصوص برای احراز هویت
export const authApiClient = axios.create({
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
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // بارگذاری توکن‌ها از localStorage هنگام مقداردهی اولیه
  useEffect(() => {
    const initializeAuth = async () => {
      const storedAccessToken = localStorage.getItem(TOKEN_KEY);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const storedRole = localStorage.getItem(USER_ROLE_KEY);

      if (storedAccessToken && storedRefreshToken && storedRole) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUserRole(storedRole);
        setUser({ username: "LoggedUser" });
        
        // تنظیم interceptor پس از بارگذاری توکن‌ها
        setupAxiosInterceptor(authApiClient);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // ==================== توابع مشترک ====================
  const logout = async () => {
    try {
      await authApiClient.post('/api/v1/Auth/logout', { refreshToken });
    } catch (error) {
      console.error("Error in logout:", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_ROLE_KEY);
      setAccessToken("");
      setRefreshToken("");
      setUser(null);
      setUserRole(null);
    }
  };

    useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // در اینجا می‌توانید یک درخواست برای بررسی اعتبار توکن بزنید
          setUser({ username: "LoggedUser" });
        } catch (error) {
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);


  // ==================== بخش ادمین ====================
  const adminLogin = async (username, password) => {
    try {
      const response = await authApiClient.post(`${BASE_URL}/api/v1/admin/Auth/login`, {
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
      const response = await authApiClient.post(
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
      const response = await authApiClient.post(
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
      const response = await authApiClient.post('/api/v1/Auth', {
        phoneNumber: studentData.phoneNumber,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        age: parseInt(studentData.age),
        gender: parseInt(studentData.gender),
        isRightHanded: studentData.isRightHanded === 'true',
        schoolId: studentData.schoolId ? parseInt(studentData.schoolId) : 0
      });

      const { accessToken, refreshToken } = response.data;
      storeTokens(accessToken, refreshToken, "student");
      setupAxiosInterceptor(authApiClient);
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
    localStorage.setItem(USER_ROLE_KEY, role);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserRole(role);
  };

  const refreshAccessToken = async () => {
    try {
      const endpoint = getRefreshEndpoint();
      const response = await authApiClient.post(
        endpoint,
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
      await logout();
      throw error;
    }
  };

  const getRefreshEndpoint = () => {
    switch(userRole) {
      case 'admin':
        return '/api/v1/admin/Auth/refresh-token';
      case 'principal':
        return '/api/v1/school-principal/Auth/refresh-token';
      case 'student':
        return '/api/v1/Auth/refresh-token';
      default:
        throw new Error('نقش کاربر نامعتبر است');
    }
  };

  // Interceptor برای مدیریت توکن
  const setupAxiosInterceptor = (axiosInstance) => {
    // حذف interceptorهای قبلی برای جلوگیری از اضافه شدن مکرر
    axiosInstance.interceptors.request.eject(requestInterceptor);
    axiosInstance.interceptors.response.eject(responseInterceptor);

    // اضافه کردن توکن به هدر درخواست‌ها
    requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // مدیریت پاسخ‌های خطا
    responseInterceptor = axiosInstance.interceptors.response.use(
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
            await logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  };

  // متغیرهای برای نگهداری reference به interceptorها
  let requestInterceptor;
  let responseInterceptor;

  return {
    user,
    accessToken,
    refreshToken,
    isFirstLogin,
    userRole,
    isLoading,
    
     adminLogin,
    
    // Principal functions
    sendOtp,
    verifyOtp,
    // توابع احراز هویت
    studentLogin,
    logout,
    
    // ابزارها
    authApiClient,
    setupAxiosInterceptor
  };
};