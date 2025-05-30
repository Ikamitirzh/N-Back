// components/SchoolDetailsModal.jsx
import React from "react";
import { X } from "lucide-react";

export default function SchoolDetailsModal({ isOpen, onClose, school }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray bg-opacity-85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-bold">جزئیات مدرسه</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام مدیر
            </label>
            <div className="border-b border-gray-300">{school.principalDetail.fullName}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شماره موبایل مدیر
            </label>
            <div className="border-b border-gray-300">{school.principalDetail.phoneNumber}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کد ملی مدیر
            </label>
            <div className="border-b border-gray-300">{school.principalDetail.nationalCode}</div>
          </div>
        </div>

        {/* اطلاعات مدرسه */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام مدرسه
            </label>
            <div className="border-b bg-gray-100 p-2 rounded-md ">{school.name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              مقاطع
            </label>
            <div className="border-b bg-gray-100 p-2 rounded-md">
              {school.level === 0 ? "ابتدایی" : school.level === 1 ? "متوسطه اول" : "متوسطه دوم"}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              استان
            </label>
            <div className="border-b bg-gray-100 p-2 rounded-md">{school.provinceName}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شهرستان
            </label>
            <div className="border-b bg-gray-100 p-2 rounded-md">{school.cityName}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کد پستی
            </label>
            <div className="border-b bg-gray-100 p-2 rounded-md">{school.postalCode}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شماره تماس
            </label>
            <div className="border-b bg-gray-100 p-2 rounded-md">{school.telNumber}</div>
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              آدرس
            </label>
            <div className="border-b bg-gray-100 p-2 rounded-md">{school.address}</div>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="flex justify-between p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 w-full bg-blue-600 text-white mx-2 rounded-md hover:bg-blue-700"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}