"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaMobileAlt, FaLock } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";

const Login = () => {
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ mobileNumber: "", password: "" });
  const [errors, setErrors] = useState({ mobileNumber: "", password: "" });

  const handleLoginModeChange = (mode: "password" | "otp") => {
    setLoginMode(mode);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrors({ mobileNumber: "", password: "" });
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth`,
        formData
      );
      if (response.data.success) {
        router.push("/dashboard");
      } else {
        throw new Error(response.data.message || "خطای نامشخص");
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert("خطایی رخ داده است. لطفاً دوباره تلاش کنید.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-right" >
      {/* سمت چپ: تصویر دختر */}
      <div className="w-1/2 flex items-center justify-center">
        <img src="/girl.png" alt="فارغ التحصیل" className="max-w-lg" />
      </div>

      {/* سمت راست: فرم لاگین */}
      <div className="w-1/2 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
          <h1 className="text-2xl font-bold text-center mb-6">ورود به سامانه</h1>

          {/* تب‌ها */}
          <div className="flex mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm ">
            <button
              onClick={() => handleLoginModeChange("password")}
              className={`w-1/2 py-2 font-medium text-m transition rounded-md ${
                loginMode === "password"
                  ? "bg-[var(--admin-login-btn)] text-[var(--admin-login-text)] shadow-md m-1.5"
                  : "bg-white text-[var(--admin-login-text)]"
              }`}
            >
              ورود با رمز عبور
            </button>
            <button
              onClick={() => handleLoginModeChange("otp")}
              className={`w-1/2 py-2 font-medium text-m transition rounded-md ${
                loginMode === "otp"
                  ? "bg-[var(--admin-login-btn)] text-[var(--admin-login-text)] shadow-md m-1.5"
                  : "bg-white text-[var(--admin-login-text)]"
              }`}
            >
              ورود با کد یکبار مصرف
            </button>
          </div>

          {/* فرم ورود */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* موبایل */}
            <div>
              <label htmlFor="mobileNumber" className="block font-semibold mb-1 text-gray-700">
                شماره موبایل
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="mobileNumber"
                  id="mobileNumber"
                  placeholder="شماره موبایل"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className={`w-full py-2 px-10 rounded-md border text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.mobileNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <FaMobileAlt className="absolute right-3 top-2.5 text-gray-400" />
              </div>
              {errors.mobileNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.mobileNumber}</p>
              )}
            </div>

            {/* رمز عبور */}
            {loginMode === "password" && (
              <div>
                <label htmlFor="password" className="block font-semibold mb-1 text-gray-700">
                  رمز عبور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="رمز عبور"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full py-2 px-10 rounded-md border text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <FaLock className="absolute right-3 top-2.5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-gray-500"
                  >
                    {showPassword ? <HiEyeOff /> : <HiEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
            )}

            {/* دکمه ورود */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
            >
              ورود
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
