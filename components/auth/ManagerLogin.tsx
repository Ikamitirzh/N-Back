"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BaseAuth from "./BaseAuth";
import ManagerForm from "./ManagerForm";
import axios from "axios";

const ManagerLogin = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

  
  const handleSendOtp = async (mobile: string) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/Auth/send-otp`,
      { mobileNumber: mobile }
    );
    return response.data;
  };

  const handleVerifyOtp = async (mobile: string, otp: string) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/Auth/verify-otp`,
      { mobileNumber: mobile, otp }
    );
    return response.data;
  };

  const handlePasswordLogin = async (mobile: string, password: string) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/Auth/login`,
      { mobileNumber: mobile, password }
    );
    return response.data;
  };

  const handleSuccess = (token: string) => {
    localStorage.setItem("managerToken", token);
    setShowForm(true);
  };

  const handleFormComplete = () => {
    router.push("/manager/dashboard");
  };

  if (showForm) {
    return (
      <div className="flex h-screen bg-gray-50 text-right">
        <div className="w-1/2 flex items-center justify-center">
          <img src="/girl.png" alt="Login" className="max-w-lg" />
        </div>
        <div className="w-1/2 flex items-center justify-center p-4">
          <ManagerForm 
            mobileNumber={mobileNumber}
            onComplete={handleFormComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <BaseAuth
      role="manager"
      onSuccess={handleSuccess}
      onSendOtp={handleSendOtp}
      onVerifyOtp={handleVerifyOtp}
      onPasswordLogin={handlePasswordLogin}
    />
  );
};

export default ManagerLogin;