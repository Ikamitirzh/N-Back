// hooks/useAuth.js
import { useState, useEffect } from "react";
import axios from "axios";
import { apiLogout } from "../utils/api";
const BASE_URL = "https://localhost:7086";
const TOKEN_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YzBmM2VjNS1hNDRjLTQzNTYtYTIwOS1hN2YyYmYyZGYwYTYiLCJpYXQiOiIxNzQ2OTg2MDQ2IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIxIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiQ29nbmlBZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3NDY5ODYwNDYsImV4cCI6MTc0Njk4OTY0NiwiaXNzIjoiQ29nbmlUZXN0IiwiYXVkIjoiQ29nbmlUZXN0In0.SNaBkmXSlB4deBheqKIQLi5e11jnJGb6nI4MSpQUiSM";
const REFRESH_TOKEN_KEY = "19a0884e98e94c01bb99484fea1f28d21f59adb897aa4757b5e32bc8818cd8f9";
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
const [isFirstLogin, setIsFirstLogin] = useState(false);
  // Load tokens from localStorage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem(TOKEN_KEY);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUser({ username: "LoggedUser" }); // یا از توکن اطلاعات استخراج کن
    }
  }, []);

  // Login
  const login = async (username, password) => {
    console.log(`bahram${username}`)
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/admin/Auth/login`, {
        userName: username,
        password: password,
      });

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser({ username });
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  // Logout
  

  const authLogout = async () => {
    try {
      await apiLogout(); // اسم بهتر برای جلوگیری از Recursion
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  // Refresh Token
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/admin/Auth/refresh-token`,
        null,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const newAccessToken = response.data.accessToken;
      localStorage.setItem(TOKEN_KEY, newAccessToken);
      setAccessToken(newAccessToken);
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  };











  // =========================================================================================================================

  
  // Send OTP
  const sendOtp = async (phoneNumber) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/school-principal/Auth/send-otp`,
        { phoneNumber }
      );
      return response.data; // { expirationSeconds }
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  };

  // Verify OTP
  const verifyOtp = async (phoneNumber, otpCode) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/school-principal/Auth/verify-otp`,
        { phoneNumber, otpCode }
      );
      
      const { token, isFirstLogin } = response.data;
      console.log(`respons : ${isFirstLogin}`);
      localStorage.setItem("accessToken", token.accessToken);
      localStorage.setItem("refreshToken", token.refreshToken);
      
      setAccessToken(token.accessToken);
      setRefreshToken(token.refreshToken);
      setIsFirstLogin(isFirstLogin);
      setUser({ phoneNumber });

      return { isFirstLogin: isFirstLogin };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };

  // Refresh Token
  const refreshAccessTokenprincipal = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/school-principal/Auth/refresh-token`,
        null,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const newAccessToken = response.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
      throw error;
    }
  };


  return {
    user,
    accessToken,
    refreshToken,
    isFirstLogin,
    sendOtp,
    verifyOtp,
    login,
    authLogout,
    refreshAccessToken,
    refreshAccessTokenprincipal
  };
};
