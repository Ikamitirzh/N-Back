"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PrincipalLogin() {
  const router = useRouter();

  // مرحله ها
  const [loginMode, setLoginMode] = useState("mobile"); // mobile | otp | profile
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(Array(5).fill(""));
  const [profileData, setProfileData] = useState({
    fullName: "",
    nationalCode: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({ mobile: "", otp: "", profile: "" });
  const [timer, setTimer] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const inputRefs = useRef([]);

  // --- API Call: Send OTP ---
  const handleSendOtp = async () => {
    if (!mobile || mobile.length !== 11) {
      setErrors((prev) => ({ ...prev, mobile: "لطفاً یک شماره معتبر وارد کنید." }));
      return;
    }

    try {
      await axios.post("https://localhost:7086/api/v1/school-principal/Auth/send-otp", {
        userName: mobile,
      });

      setErrors((prev) => ({ ...prev, mobile: "" }));
      setLoginMode("otp");
      startTimer();
    } catch (error) {
      setErrors((prev) => ({ ...prev, mobile: "خطا در ارسال کد یکبار مصرف" }));
    }
  };

  // --- API Call: Verify OTP ---
  const handleVerifyOtp = async () => {
    const code = otp.join("");

    if (code.length !== 5) {
      setErrors((prev) => ({ ...prev, otp: "لطفاً کد یکبار مصرف را کامل کنید." }));
      return;
    }

    try {
      const response = await axios.post("https://localhost:7086/api/v1/school-principal/Auth/verify-otp", {
        userName: mobile,
        otp: code,
      });

      const { accessToken, refreshToken, isFirstLogin } = response.data;

      localStorage.setItem("principalAccessToken", accessToken);
      localStorage.setItem("principalRefreshToken", refreshToken);

      if (isFirstLogin) {
        setLoginMode("profile");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, otp: "کد وارد شده نامعتبر است." }));
    }
  };

  // --- API Call: Save Profile ---
  const handleSaveProfile = async () => {
    if (!profileData.fullName || !profileData.nationalCode || !profileData.phoneNumber) {
      setErrors((prev) => ({ ...prev, profile: "لطفاً تمامی فیلد‌ها را پر کنید." }));
      return;
    }

    try {
      await axios.post("https://localhost:7086/api/v1/school-principal/Profiles", profileData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("principalAccessToken")}`,
        },
      });

      router.push("/admin/dashboard");
    } catch (error) {
      setErrors((prev) => ({ ...prev, profile: "خطا در ذخیره اطلاعات." }));
    }
  };

  // --- OTP Input Handling ---
  const handleChangeOtp = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 4 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // --- Timer ---
  const startTimer = () => {
    setTimer(120);
    setIsResendDisabled(true);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // --- Resend OTP ---
  const handleResendOtp = () => {
    handleSendOtp();
  };

  // --- Render Mobile Input ---
  if (loginMode === "mobile") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">ورود مدیر</h2>
          <p className="mb-4 text-gray-600">برای ورود، شماره موبایل خود را وارد کنید.</p>

          <input
            type="text"
            placeholder="شماره موبایل"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className={`w-full p-2 border ${
              errors.mobile ? "border-red-500" : "border-gray-300"
            } rounded-lg mb-2`}
          />
          {errors.mobile && <p className="text-red-500 text-sm mb-4">{errors.mobile}</p>}

          <button
            onClick={handleSendOtp}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            دریافت کد
          </button>
        </div>
      </div>
    );
  }

  // --- Render OTP Input ---
  if (loginMode === "otp") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">تایید کد یکبار مصرف</h2>
          <p className="mb-4 text-gray-600">کد یکبار مصرف به شماره `{mobile}` ارسال شد.</p>

          <div className="flex justify-between my-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChangeOtp(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl border rounded focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          {errors.otp && <p className="text-red-500 text-sm mb-4">{errors.otp}</p>}

          <button
            type="button"
            onClick={handleVerifyOtp}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            تایید کد
          </button>

          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              {timer > 0 ? `ارسال مجدد بعد از ${timer} ثانیه` : (
                <button
                  onClick={handleResendOtp}
                  disabled={isResendDisabled}
                  className={`text-blue-600 underline ${isResendDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  ارسال مجدد کد
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Profile Form (for first login) ---
  if (loginMode === "profile") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">ثبت اولیه اطلاعات</h2>
          <p className="mb-4 text-gray-600">لطفاً اطلاعات خود را کامل کنید.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نام و نام خانوادگی</label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) =>
                  setProfileData({ ...profileData, fullName: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">کد ملی</label>
              <input
                type="text"
                value={profileData.nationalCode}
                onChange={(e) =>
                  setProfileData({ ...profileData, nationalCode: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس</label>
              <input
                type="text"
                value={profileData.phoneNumber}
                onChange={(e) =>
                  setProfileData({ ...profileData, phoneNumber: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {errors.profile && <p className="text-red-500 text-sm mt-2">{errors.profile}</p>}

          <button
            onClick={handleSaveProfile}
            className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            ذخیره اطلاعات
          </button>
        </div>
      </div>
    );
  }

  return null;
}