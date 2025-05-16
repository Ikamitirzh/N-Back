"use client";
import { useState } from "react";
import axios from "axios";

const ManagerForm = ({ 
  mobileNumber,
  onComplete 
}: { 
  mobileNumber: string;
  onComplete: () => void 
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalCode: "",
    management: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/manager/complete-info`,
        {
          mobileNumber,
          ...formData
        }
      );
      onComplete();
    } catch (error) {
      alert("خطا در ثبت اطلاعات");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
      <h1 className="text-2xl font-bold text-center mb-6">تکمیل اطلاعات</h1>
      
      <form onSubmit={handleSubmit}>
        {/* فیلدهای دقیقاً مشابه تصویر شما */}
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-gray-700">نام*</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="نام خود را وارد کنید"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1 text-gray-700">نام خانوادگی*</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="نام خانوادگی خود را وارد کنید"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1 text-gray-700">کد ملی*</label>
          <input
            type="text"
            name="nationalCode"
            value={formData.nationalCode}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-1 text-gray-700">نام مدیریت*</label>
          <select
            name="management"
            value={formData.management}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">انتخاب کنید</option>
            <option value="management1">مدیریت ۱</option>
            <option value="management2">مدیریت ۲</option>
          </select>
        </div>

        <button
          type="submit"
          className={`w-full bg-green-600 text-white py-2 rounded-md font-semibold transition ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "در حال پردازش..." : "تایید و ادامه"}
        </button>
      </form>
    </div>
  );
};

export default ManagerForm;