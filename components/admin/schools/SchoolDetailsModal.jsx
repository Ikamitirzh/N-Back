// components/SchoolDetailsModal.js
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
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام مدرسه
            </label>
            <div className="border-b border-gray-300">{school.name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              مقاطع
            </label>
            <div className="border-b border-gray-300">{school.level}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شهرستان
            </label>
            <div className="border-b border-gray-300">{school.city}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کد پستی
            </label>
            <div className="border-b border-gray-300">{school.postalCode}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شماره تماس
            </label>
            <div className="border-b border-gray-300">{school.phone}</div>
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              آدرس
            </label>
            <div className="border-b border-gray-300">{school.address}</div>
          </div>
        </div>
      </div>
    </div>
  );
}