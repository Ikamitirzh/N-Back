import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ComboBox from "../../ComboBox";

export default function SchoolModal({ isOpen, onClose, onSave, school, onChange }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    postalCode: "",
    telNumber: "",
    level: 0, // مقدار اولیه رو به عدد 0 تنظیم می‌کنیم
    provinceId: null,
    cityId: null,
  });
  
  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name || "",
        address: school.address || "",
        postalCode: school.postalCode || "",
        telNumber: school.telNumber || "",
        level: parseInt(school.level) || 0, // مطمئن می‌شیم که level یه عدد باشه
        provinceId: school.provinceId || null,
        cityId: school.cityId || null,
      });
    } else {
      setFormData({
        name: "",
        address: "",
        postalCode: "",
        telNumber: "",
        level: 0,
        provinceId: null,
        cityId: null,
      });
    }
  }, [school]);

  const handleChange = (field, value) => {
    let finalValue = value;

    if (field === "level") {
      finalValue = parseInt(value);
      if (isNaN(finalValue)) finalValue = 0; // اگر NaN بود، 0 بذار
      console.log(`Level changed to: ${finalValue}`); // برای دیباگ
    }

    setFormData((prev) => ({ ...prev, [field]: finalValue }));
    if (onChange) onChange(field, finalValue);
  };

  const handleProvinceChange = (province) => {
    const id = parseInt(province.id);
    setFormData((prev) => ({ ...prev, provinceId: id }));
    if (onChange) onChange("provinceId", id);
  };

  const handleCityChange = (city) => {
    const id = parseInt(city.id);
    setFormData((prev) => ({ ...prev, cityId: id }));
    if (onChange) onChange("cityId", id);
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      level: parseInt(formData.level) || 0,
      provinceId: parseInt(formData.provinceId) || null,
      cityId: parseInt(formData.cityId) || null,
    };
    onSave(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray bg-opacity-85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-bold">
            {school?.id ? "ویرایش مدرسه" : "افزودن مدرسه"}
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
              value={formData.level}
              onChange={(e) => handleChange("level", e.target.value)}
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
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              استان <span className="text-red-500">*</span>
            </label>
            <ComboBox
              label="استان"
              apiEndpoint="Provinces"
              selectedValue={formData.provinceId}
              onChange={(option) => {
                handleChange("provinceId", option.id);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شهرستان <span className="text-red-500">*</span>
            </label>
            <ComboBox
              label="شهرستان"
              apiEndpoint={`Cities?provinceId=${formData.provinceId}`}
              selectedValue={
                formData.cityId
                  ? { id: formData.cityId, name: school?.cityName  }
                  : null
              }
              onChange={handleCityChange}
              disabled={!formData.provinceId}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کد پستی
            </label>
            <input
              type="text"
              placeholder="کد پستی"
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
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
                value={formData.telNumber}
                onChange={(e) => handleChange("telNumber", e.target.value)}
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
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>
        </div>

        <div className="flex justify-between p-4 border-t">
          <button
            onClick={handleSubmit}
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