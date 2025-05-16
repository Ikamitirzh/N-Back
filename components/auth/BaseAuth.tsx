"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaMobileAlt, FaLock, FaCheck } from "react-icons/fa";
import { HiEye, HiEyeOff, HiArrowLeft } from "react-icons/hi";

type AuthMode = "password" | "otp" | "otp-verify";
type UserRole = "admin" | "manager";

interface BaseAuthProps {
  role: UserRole;
  onSuccess: (token: string) => void;
  onSendOtp: (mobile: string) => Promise<{ success: boolean }>;
  onVerifyOtp: (mobile: string, otp: string) => Promise<{ success: boolean; token?: string }>;
  onPasswordLogin: (mobile: string, password: string) => Promise<{ success: boolean; token?: string }>;
}

const BaseAuth = ({ 
  role, 
  onSuccess, 
  onSendOtp, 
  onVerifyOtp, 
  onPasswordLogin 
}: BaseAuthProps) => {
  const [mode, setMode] = useState<AuthMode>("password");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
    otp: Array(5).fill("")
  });
  const [errors, setErrors] = useState({ mobileNumber: "", password: "", otp: "" });
  const [isLoading, setIsLoading] = useState(false);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // توابع تغییر حالت و مدیریت OTP (همانند کد قبلی شما)
  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...formData.otp];
      newOtp[index] = value;
      setFormData(prev => ({ ...prev, otp: newOtp }));

      if (value && index < 4 && otpInputs.current[index + 1]) {
        otpInputs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const changeMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({ mobileNumber: "", password: "", otp: "" });
  };

  // ارسال OTP (مطابق Swagger)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await onSendOtp(formData.mobileNumber);
      if (response.success) {
        setMode("otp-verify");
      } else {
        setErrors({ ...errors, mobileNumber: "خطا در ارسال کد" });
      }
    } catch (error) {
      setErrors({ ...errors, mobileNumber: "خطا در ارتباط با سرور" });
    } finally {
      setIsLoading(false);
    }
  };

  // تایید OTP (مطابق Swagger)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const otpCode = formData.otp.join("");
      const response = await onVerifyOtp(formData.mobileNumber, otpCode);
      if (response.success && response.token) {
        onSuccess(response.token);
      } else {
        setErrors({ ...errors, otp: "کد وارد شده نامعتبر است" });
      }
    } catch (error) {
      setErrors({ ...errors, otp: "خطا در بررسی کد" });
    } finally {
      setIsLoading(false);
    }
  };

  // ورود با رمز عبور (مطابق Swagger)
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await onPasswordLogin(formData.mobileNumber, formData.password);
      if (response.success && response.token) {
        onSuccess(response.token);
      } else {
        setErrors({ ...errors, password: "شماره موبایل یا رمز عبور اشتباه است" });
      }
    } catch (error) {
      setErrors({ ...errors, password: "خطا در ارتباط با سرور" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "otp-verify" && otpInputs.current[0]) {
      otpInputs.current[0]?.focus();
    }
  }, [mode]);

  return (
    <div className="flex h-screen bg-gray-50 text-right">
      {/* سمت چپ: تصویر دختر (همانند کد شما) */}
      <div className="w-1/2 flex items-center justify-center">
        <img src="/girl.png" alt="فارغ التحصیل" className="max-w-lg" />
      </div>

      {/* سمت راست: فرم لاگین (دقیقاً مشابه کد شما) */}
      <div className="w-1/2 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
          {mode === "otp-verify" ? (
            <div className="flex items-center mb-6 cursor-pointer" onClick={() => changeMode("otp")}>
              <HiArrowLeft className="text-gray-500 ml-2" />
              <h1 className="text-2xl font-bold">تایید شماره موبایل</h1>
            </div>
          ) : (
            <h1 className="text-2xl font-bold text-center mb-6">ورود به سامانه</h1>
          )}

          {/* تب‌ها (دقیقاً مشابه کد شما) */}
          {mode !== "otp-verify" && (
            <div className="flex mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => changeMode("password")}
                className={`w-1/2 py-2 font-medium text-m transition rounded-md ${
                  mode === "password"
                    ? "bg-[var(--admin-login-tab)] text-[var(--admin-login-text)] shadow-md m-1.5"
                    : "bg-white text-[var(--admin-login-text)]"
                }`}
              >
                ورود با رمز عبور
              </button>
              <button
                onClick={() => changeMode("otp")}
                className={`w-1/2 py-2 font-medium text-m transition rounded-md ${
                  mode === "otp"
                    ? "bg-[var(--admin-login-tab)] text-[var(--admin-login-text)] shadow-md m-1.5"
                    : "bg-white text-[var(--admin-login-text)]"
                }`}
              >
                ورود با کد یکبار مصرف
              </button>
            </div>
          )}

          {/* فرم‌ها */}
          <form onSubmit={
            mode === "password" ? handlePasswordLogin : 
            mode === "otp" ? handleSendOtp : 
            handleVerifyOtp
          }>
            {/* فیلد شماره موبایل (دقیقاً مشابه کد شما) */}
            <div>
              {mode != "password" && (
                <p className="text-center m-7 text-gray-700">برای دریافت کد یکبار مصرف شماره موبایل خود را وارد کنید.</p>
              )}
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
                  disabled={mode === "otp-verify"}
                  className={`w-full py-2 px-10 rounded-md border text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.mobileNumber ? "border-red-500" : "border-gray-300"
                  } ${mode === "otp-verify" ? "bg-gray-100" : ""}`}
                />
                <FaMobileAlt className="absolute right-3 top-2.5 text-gray-400" />
                {mode === "otp-verify" && (
                  <FaCheck className="absolute left-3 top-3 text-green-500" />
                )}
              </div>
              {errors.mobileNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.mobileNumber}</p>
              )}
            </div>

            {/* فیلد رمز عبور (دقیقاً مشابه کد شما) */}
            {mode === "password" && (
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

            {/* فیلدهای OTP (دقیقاً مشابه کد شما) */}
            {mode === "otp-verify" && (
              <div className="my-4">
                <label className="block font-semibold mb-2 text-gray-700">
                  کد یکبار مصرف
                </label>
                <div className="flex justify-between">
  {formData.otp.map((digit, index) => (
    <input
      key={index}
      type="text"
      maxLength={1}
      value={digit}
      onChange={(e) => handleOtpChange(index, e.target.value)}
      onKeyDown={(e) => handleOtpKeyDown(index, e)}
      ref={(el) => {
        if (el) {
          otpInputs.current[index] = el;
        }
      }}
      className="w-10 h-10 border rounded text-center text-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  ))}
</div>
                {errors.otp && (
                  <p className="text-sm text-red-500 mt-1">{errors.otp}</p>
                )}
                <p className="text-sm text-gray-500 mt-3">
                  کد به شماره {formData.mobileNumber} ارسال شد
                </p>
              </div>
            )}

            {/* دکمه ارسال/تایید (دقیقاً مشابه کد شما) */}
            <button
              type="submit"
              className={`w-full bg-[var(--admin-login-btn)] hover:bg-[var(--admin-login-btn-hover)] text-white py-2 rounded-md font-semibold transition mt-4 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                "در حال پردازش..."
              ) : mode === "password" ? (
                "ورود"
              ) : mode === "otp" ? (
                "دریافت کد"
              ) : (
                "تایید کد"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BaseAuth;