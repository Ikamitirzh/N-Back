// lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// types/auth.d.ts یا lib/types.ts
export interface LoginCredentials {
    mobileNumber: string;
    password?: string; // optional (برای حالت OTP)
  }

// lib/api.ts






export const login = async (data: LoginCredentials) => {
  try {
    const response = await api.post('/Auth', data);
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};

// // مثال: تابع برای ارسال اطلاعات آزمون
// export const submitTestResult = async (data) => {
//   try {
//     const response = await api.post('/TestResults', data);
//     return response.data;
//   } catch (error) {
//     throw new Error('Failed to submit test results');
//   }
// };