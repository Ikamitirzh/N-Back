// components/SchoolModal.js

import { X } from "lucide-react";

export default function SchoolModal({
  isOpen,
  onClose,
  onSave,
  school,
  onChange,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray bg-opacity-85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-bold">
            {school.id ? "ویرایش مدرسه" : "افزودن مدرسه"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          مقاطع <span className="text-red-500">*</span>
        </label>
        <select
          value={school.level} // مطمئن شوید که school.level هم با این مقادیر عددی هماهنگ است
          onChange={(e) => onChange("level", parseInt(e.target.value))} // تبدیل مقدار به عدد
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          >
            
            <option value="0">ابتدایی</option>
            <option value="1">متوسطه اول</option>
            <option value="2">متوسطه دوم</option>
        </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام مدرسه <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="نام مدرسه را وارد کنید"
              value={school.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              استان <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="استان را وارد کنید"
              value={school.city}
              onChange={(e) => onChange("city", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شهرستان <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="شهرستان را وارد کنید"
              value={school.city}
              onChange={(e) => onChange("city", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کد پستی
            </label>
            <input
              type="text"
              placeholder="کد پستی"
              value={school.postalCode}
              onChange={(e) => onChange("postalCode", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شماره تماس <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                +۹۸
              </span>
              <input
                type="text"
                placeholder="مثال: ۰۹۱۲۳۴۵۶۷"
                value={school.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-16 p-2"
              />
            </div>
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              آدرس <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="آدرس را وارد کنید"
              value={school.address}
              onChange={(e) => onChange("address", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-between p-4 border-t">
          <button
            onClick={onSave}
            className="px-4 py-2 w-full bg-blue-600 text-white mx-2 rounded-md hover:bg-blue-700"
          >
            ذخیره
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 w-full text-gray-700 mx-2 rounded-md hover:bg-gray-100"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}