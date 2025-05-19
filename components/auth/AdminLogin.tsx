"use client";
import { useRouter } from "next/navigation";
import BaseAuth from "./BaseAuth";
import axios from "axios";

const AdminLogin = () => {
  const router = useRouter();

  // توابع API مطابق Swagger
  const handleSendOtp = async (mobile: string) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/Auth/send-otp`,
      { mobileNumber: mobile }
    );
    return response.data;
  };

  const handleVerifyOtp = async (mobile: string, otp: string) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/Auth/verify-otp`,
      { mobileNumber: mobile, otp }
    );
    return response.data;
  };

  const handlePasswordLogin = async (mobile: string, password: string) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/Auth/login`,
      { mobileNumber: mobile, password }
    );
    return response.data;
  };

  const handleSuccess = (token: string) => {
    // ذخیره توکن و ریدایرکت
    localStorage.setItem("adminToken", token);
    router.push("/admin/dashboard");
  };

  return (
    <BaseAuth
      role="admin"
      onSuccess={handleSuccess}
      onSendOtp={handleSendOtp}
      onVerifyOtp={handleVerifyOtp}
      onPasswordLogin={handlePasswordLogin}
    />
  );
};

export default AdminLogin;