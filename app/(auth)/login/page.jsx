"use client";
import React, { useState, useRef, useEffect } from "react";

import { useRouter } from "next/navigation";
import { FaMobileAlt, FaLock, FaCheck, FaUser, FaIdCard, FaSchool } from "react-icons/fa";
import { HiEye, HiEyeOff, HiArrowLeft, HiX } from "react-icons/hi";
import { useAuth } from "../../../hooks/useAuth";
import ComboBox from "../../../components/ComboBoxUser";

// Base API URL
const BASE_URL = "https://localhost:7086";

/**
 * PrincipalLogin Component - Handles school principal authentication flow
 * Includes OTP verification, password login, and profile completion
 */
export default function PrincipalLogin() {
  const router = useRouter();
  
  // State for managing login mode (otp, password, otp-verify, profile)
  const [loginMode, setLoginMode] = useState("otp");
  
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // Form data state for authentication
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
    otp: Array(5).fill(""),
  });

  const { authApiClient } = useAuth();
  console.log(formData.phoneNumber);

  const validatePhoneNumber = (phone) => {
  return /^09\d{9}$/.test(phone);
};

// تابع اعتبارسنجی کد ملی
const validateNationalCode = (code) => {
  return code.length === 10;
};

// تابع اعتبارسنجی متن (بدون عدد)
const validateTextInput = (value) => {
  return !/\d/.test(value);
};

// تابع اعتبارسنجی عددی
const validateNumericInput = (value) => {
  return /^\d*$/.test(value);
};

  
  // Profile data state for first-time users
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    nationalCode: "",
    provinceId: '',
    cityId: '',
    schoolId: '',
    provinceName: '',
    cityName: '',
  });

  // State for school list
  const [schools, setSchools] = useState([]);
  
  // Error handling state
  const [errors, setErrors] = useState({
    phoneNumber: "",
    password: "",
    otp: "",
    profile: "",
  });

  console.log(schools);
  
  // Loading state for API calls
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP timer state
  const [timer, setTimer] = useState(0);
  
  // Flag for first-time login
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  // Refs for OTP input fields
  const otpInputs = useRef([]);
  const { sendOtp, verifyOtp, adminLogin } = useAuth();

  /**
   * Fetches schools list when cityId changes
   */
  useEffect(() => {
    const fetchSchools = async () => {
      if (profileData.cityId) {
        try {
          const response = await authApiClient.get(`${BASE_URL}/api/v1/Schools`, {
            params: { cityId: profileData.cityId },
          });
          setSchools(response.data.items || response.data);
        } catch (error) {
          console.error("Error fetching schools:", error);
        }
      }
    };
    fetchSchools();
  }, [profileData.cityId]);

  /**
   * Handles OTP input changes with validation
   * @param {number} index - OTP digit position
   * @param {string} value - Input value
   */
  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...formData.otp];
      newOtp[index] = value;
      setFormData(prev => ({ ...prev, otp: newOtp }));
      if (value && index < 4 && otpInputs.current[index + 1]) {
        otpInputs.current[index + 1]?.focus();
      }
    }
  };

  /**
   * Countdown timer for OTP verification
   */
  useEffect(() => {
    if (loginMode === "otp-verify" && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loginMode, timer]);

  /**
   * Handles OTP request
   * @param {Event} e - Form event
   */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await sendOtp(formData.phoneNumber);
      setTimer(response.expirationSeconds);
      setLoginMode("otp-verify");
    } catch (error) {
      setErrors({ ...errors, phoneNumber: "خطا در ارسال کد یکبار مصرف" });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verifies entered OTP code
   * @param {Event} e - Form event
   */
 const handleVerifyOtp = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const otpCode = formData.otp.join("");
    const response = await verifyOtp(formData.phoneNumber, otpCode);
    
    if (!response.isFirstLogin) {
      // کاربر پروفایل را تکمیل کرده، مستقیماً به داشبورد با schoolId هدایت شود
      const schoolId =  profileData.schoolId;
      console.log(`schoolId: ${schoolId}`)
      if (schoolId) {
        router.push(`/pages/principal/main?schoolId=${schoolId}`);
    } else {
      // کاربر پروفایل را تکمیل نکرده، فرم تکمیل پروفایل را نمایش بده
      setIsFirstLogin(true);
      setLoginMode("profile");
    }
  }} catch (error) {
    setErrors({ ...errors, otp: "کد وارد شده نامعتبر است" });
  } finally {
    setIsLoading(false);
  }
};


  /**
   * Saves profile information for first-time users
   */
  const handleSaveProfile = async () => {
  if (!profileData.firstName || !profileData.lastName || !profileData.nationalCode || !profileData.schoolId) {
    setErrors({ ...errors, profile: "لطفاً تمام فیلدهای ضروری را پر کنید" });
    return;
  }
  setIsLoading(true);
  try {
    await authApiClient.put(`${BASE_URL}/api/v1/school-principal/Profiles`, {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      nationalCode: profileData.nationalCode,
      schoolId: profileData.schoolId,
    });
    router.push(`/pages/principal/main?schoolId=${profileData.schoolId}`);
  } catch (error) {
    setErrors({ ...errors, profile: "خطا در ذخیره اطلاعات" });
  } finally {
    setIsLoading(false);
  }
};

  /**
   * Handles profile form input changes
   * @param {Event} e - Input event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };
  
  /**
   * Handles authentication form input changes
   * @param {Event} e - Input event
   */
  const handleChangeOtp = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  /**
   * Handles password login submission
   * @param {Event} e - Form event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(formData.phoneNumber, formData.password);
      router.push("pages/admin/schools");
    } catch (error) {
      setErrors({ ...errors, password: "نام کاربری یا رمز عبور نادرست است" });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-right font-[IRANSansXFaNum]">
      {/* Right Side: Login Form */}
      <div className="w-1/2 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
          {/* Dynamic title based on login mode */}
          {loginMode === "otp-verify" ? (
            <div className="flex items-center mb-6 cursor-pointer" onClick={() => setLoginMode("otp")}>
              <HiArrowLeft className="text-gray-500 ml-2" />
              <h1 className="text-2xl font-bold">تایید شماره موبایل</h1>
            </div>
          ) : loginMode === "profile" ? (
            <h1 className="text-2xl font-bold text-center mb-6">تکمیل اطلاعات پروفایل</h1>
          ) : (
            <h1 className="text-2xl font-bold text-center mb-6">ورود به سامانه</h1>
          )}

          {/* Login method tabs (shown only in initial states) */}
          {loginMode === "password" || loginMode === "otp" ? (
            <div className="flex mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setLoginMode("password")}
                className={`w-1/2 py-2 font-medium text-m transition rounded-md ${
                  loginMode === "password"
                    ? "bg-blue-100 text-blue-600 shadow-md m-1.5"
                    : "bg-white text-gray-600"
                }`}
              >
                ورود با رمز عبور
              </button>
              <button
                onClick={() => setLoginMode("otp")}
                className={`w-1/2 py-2 font-medium text-m transition rounded-md ${
                  loginMode === "otp"
                    ? "bg-blue-100 text-blue-600 shadow-md m-1.5"
                    : "bg-white text-gray-600"
                }`}
              >
                ورود با کد یکبار مصرف
              </button>
            </div>
          ) : null}

          {/* Password login form */}
          {loginMode === "password" && (
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="phoneNumber" className="block font-semibold mb-1 text-gray-700">
                  شماره موبایل
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="09xxxxxxxxx"
                    value={formData.phoneNumber}
                    onChange={handleChangeOtp}
                    className={`w-full py-2 px-10 rounded-md border text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <FaMobileAlt className="absolute right-3 top-2.5 text-gray-400" />
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div className="mt-4">
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
                    onChange={handleChangeOtp}
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

              <button
                type="submit"
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition mt-4 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "در حال پردازش..." : "ورود"}
              </button>
            </form>
          )}

          {/* OTP request form */}
          {loginMode === "otp" && (
            <form onSubmit={handleSendOtp}>
              <p className="text-center m-7 text-gray-700">برای دریافت کد یکبار مصرف شماره موبایل خود را وارد کنید.</p>
              <div>
                <label htmlFor="phoneNumber" className="block font-semibold mb-1 text-gray-700">
                  شماره موبایل
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="09xxxxxxxxx"
                    value={formData.phoneNumber}
                    onChange={handleChangeOtp}
                    className={`w-full py-2 px-10 rounded-md border text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <FaMobileAlt className="absolute right-3 top-2.5 text-gray-400" />
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <button
                type="submit"
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition mt-4 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "در حال پردازش..." : "دریافت کد"}
              </button>
            </form>
          )}

          {/* OTP verification form */}
          {loginMode === "otp-verify" && (
            <form onSubmit={handleVerifyOtp}>
              <div>
                <label htmlFor="phoneNumber" className="block font-semibold mb-1 text-gray-700">
                  شماره موبایل
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="09xxxxxxxxx"
                    value={formData.phoneNumber}
                    onChange={handleChangeOtp}
                    disabled={true}
                    className="w-full py-2 px-10 rounded-md border text-gray-700 bg-gray-100"
                  />
                  <FaMobileAlt className="absolute right-3 top-2.5 text-gray-400" />
                  <FaCheck className="absolute left-3 top-3 text-green-500" />
                </div>
              </div>

              <div className="my-4">
                <label className="block font-semibold mb-2 text-gray-700">
                  کد یکبار مصرف
                </label>
                <div className="flex justify-between" dir="ltr">
                  {formData.otp.map((_, i, arr) => {
                    const index = i; // Left-to-right order
                    return (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={formData.otp[index]}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
                            otpInputs.current[index - 1]?.focus();
                          }
                        }}
                        ref={(el) => {
                          if (el) {
                            otpInputs.current[index] = el;
                          }
                        }}
                        className="w-10 h-10 border rounded text-center text-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    );
                  })}
                </div>
                {errors.otp && (
                  <p className="text-sm text-red-500 mt-1">{errors.otp}</p>
                )}
                <p className="text-sm text-gray-500 mt-3">
                  کد به شماره {formData.phoneNumber} ارسال شد
                </p>
              </div>

              {timer > 0 && (
                <div className="text-center my-4">
                  <p className="text-gray-700">
                    زمان باقیمانده: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}
                  </p>
                </div>
              )}

              {timer === 0 && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-blue-500 text-sm mt-2"
                >
                  ارسال مجدد کد
                </button>
              )}

              <button
                type="submit"
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition mt-4 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "در حال پردازش..." : "تایید کد"}
              </button>
            </form>
          )}

          {/* Profile completion form */}
          {loginMode === "profile" && (
            <div className="mt-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, firstName: e.target.value })
                      }
                      className="w-full p-2 pl-10 border border-gray-300 rounded"
                    />
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, lastName: e.target.value })
                      }
                      className="w-full p-2 pl-10 border border-gray-300 rounded"
                    />
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">کد ملی</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profileData.nationalCode}
                      onChange={(e) =>
                        setProfileData({ ...profileData, nationalCode: e.target.value })
                      }
                      className="w-full p-2 pl-10 border border-gray-300 rounded"
                    />
                    <FaIdCard className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <ComboBox
                      label="استان"
                      apiEndpoint="Provinces"
                      selectedValue={
                        profileData.provinceId
                          ? { id: profileData.provinceId, name: profileData.provinceName }
                          : null
                      }
                      onChange={(option) => {
                        setProfileData((prev) => ({
                          ...prev,
                          provinceId: option.id,
                          provinceName: option.name,
                          cityId: '',
                          cityName: '',
                          schoolId: '',
                        }));
                        setSchools([]);
                      }}
                    />
                  </div>
                  <div>
                    <ComboBox
                      label="شهرستان"
                      apiEndpoint="Cities"
                      selectedValue={
                        profileData.cityId ? { id: profileData.cityId, name: profileData.cityName } : null
                      }
                      onChange={(option) => {
                        setProfileData((prev) => ({
                          ...prev,
                          cityId: option.id,
                          cityName: option.name,
                          schoolId: '',
                        }));
                      }}
                      disabled={!profileData.provinceId}
                      params={{ provinceId: profileData.provinceId }}
                    />
                  </div>
                </div>

                {/* School selection */}
                <div>
                  <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-1">
                    نام مدرسه:
                  </label>
                  <select
                    id="schoolId"
                    name="schoolId"
                    value={profileData.schoolId}
                    onChange={handleChange}
                    disabled={!profileData.cityId || schools.length === 0}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">
                      {profileData.cityId ? 'انتخاب کنید' : 'ابتدا شهر را انتخاب کنید'}
                    </option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.profile && <p className="text-red-500 text-sm mt-2">{errors.profile}</p>}
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-70"
              >
                {isLoading ? "در حال ذخیره..." : "ذخیره اطلاعات"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Left Side: Illustration */}
      <div className="w-1/2 flex items-center justify-center">
        <img src="/girl.png" alt="فارغ التحصیل" className="max-w-lg" />
      </div>
    </div>
  );
}