import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ComboBox from "../../ComboBox";

export default function SchoolModal({ isOpen, onClose, onSave, school, onChange }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    postalCode: "",
    telNumber: "",
    level: 0,
    provinceId: null,
    cityId: null,
    provinceName: "",
    cityName: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    address: "",
    telNumber: "",
    provinceId: "",
    cityId: "",
    postalCode: ""
  });

  useEffect(() => {
    if (school) {
      if (school.provinceDetail || school.cityDetail) {
        setFormData({
          name: school.name || "",
          address: school.address || "",
          postalCode: school.postalCode || "",
          telNumber: school.telNumber || "",
          level: parseInt(school.level) || 0,
          provinceId: school.provinceDetail?.id || null,
          cityId: school.cityDetail?.id || null,
          provinceName: school.provinceDetail?.name || "",
          cityName: school.cityDetail?.name || ""
        });
      } else {
        setFormData({
          name: school.name || "",
          address: school.address || "",
          postalCode: school.postalCode || "",
          telNumber: school.telNumber || "",
          level: parseInt(school.level) || 0,
          provinceId: school.provinceId || null,
          cityId: school.cityId || null,
          provinceName: "",
          cityName: ""
        });
      }
    } else {
      setFormData({
        name: "",
        address: "",
        postalCode: "",
        telNumber: "",
        level: 0,
        provinceId: null,
        cityId: null,
        provinceName: "",
        cityName: ""
      });
    }
    // Reset errors when modal opens
    setErrors({
      name: "",
      address: "",
      telNumber: "",
      provinceId: "",
      cityId: "",
      postalCode: ""
    });
  }, [school, isOpen]);

  // اعتبارسنجی‌ها
  const validatePhoneNumber = (phone) => /^0\d{10}$/.test(phone);
  const validatePostalCode = (code) => /^\d{10}$/.test(code);
  const validateTextInput = (value) => !/\d/.test(value);
  const validateNumericInput = (value) => /^\d*$/.test(value);

  const handleChange = (field, value) => {
    let finalValue = value;

    if (field === "level") {
      finalValue = parseInt(value);
      if (isNaN(finalValue)) finalValue = 0;
    }

    // اعتبارسنجی فیلدهای متنی (نام مدرسه)
    if (field === "name") {
      if (!validateTextInput(value)) return;
      setErrors({...errors, name: ""});
    }
    
    // اعتبارسنجی شماره تلفن
    if (field === "telNumber") {
      if (!validateNumericInput(value)) return;
      if (value.length > 11) return;
      setErrors({...errors, telNumber: value.length === 11 && !validatePhoneNumber(value) ? 
        'شماره تماس باید 11 رقمی و با 0 شروع شود' : ''});
    }
    
    // اعتبارسنجی کد پستی
    if (field === "postalCode" && value) {
      if (!validateNumericInput(value)) return;
      if (value.length > 10) return;
      setErrors({...errors, postalCode: value.length === 10 ? '' : 'کد پستی باید 10 رقمی باشد'});
    }

    setFormData(prev => ({ ...prev, [field]: finalValue }));
    if (onChange) onChange(field, finalValue);
  };

  const handleProvinceChange = (province) => {
    setFormData(prev => ({
      ...prev,
      provinceId: province.id,
      provinceName: province.name,
      cityId: null,
      cityName: ""
    }));
    setErrors({...errors, provinceId: ""});
  };

  const handleCityChange = (city) => {
    setFormData(prev => ({
      ...prev,
      cityId: city.id,
      cityName: city.name
    }));
    setErrors({...errors, cityId: ""});
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // اعتبارسنجی نام مدرسه
    if (!formData.name.trim()) {
      newErrors.name = 'نام مدرسه الزامی است';
      isValid = false;
    } else if (!validateTextInput(formData.name)) {
      newErrors.name = 'نام مدرسه نمی‌تواند شامل عدد باشد';
      isValid = false;
    }

    // اعتبارسنجی آدرس
    if (!formData.address.trim()) {
      newErrors.address = 'آدرس الزامی است';
      isValid = false;
    }

    // اعتبارسنجی شماره تماس
    if (!formData.telNumber) {
      newErrors.telNumber = 'شماره تماس الزامی است';
      isValid = false;
    } else if (!validatePhoneNumber(formData.telNumber)) {
      newErrors.telNumber = 'شماره تماس باید 11 رقمی و با 0 شروع شود';
      isValid = false;
    }

    // اعتبارسنجی استان و شهر
    if (!formData.provinceId) {
      newErrors.provinceId = 'انتخاب استان الزامی است';
      isValid = false;
    }
    if (!formData.cityId) {
      newErrors.cityId = 'انتخاب شهرستان الزامی است';
      isValid = false;
    }

    // اعتبارسنجی کد پستی (اختیاری اما اگر وارد شده باید معتبر باشد)
    if (formData.postalCode && !validatePostalCode(formData.postalCode)) {
      newErrors.postalCode = 'کد پستی باید 10 رقمی باشد';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const submitData = {
      name: formData.name,
      address: formData.address,
      postalCode: formData.postalCode,
      telNumber: formData.telNumber,
      level: formData.level,
      provinceId: formData.provinceId,
      cityId: formData.cityId
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
              className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              استان <span className="text-red-500">*</span>
            </label>
            <ComboBox
              label="استان"
              apiEndpoint="Provinces"
              selectedValue={
                formData.provinceId && formData.provinceName
                  ? { id: formData.provinceId, name: formData.provinceName }
                  : null
              }
              onChange={handleProvinceChange}
              error={errors.provinceId}
            />
            {errors.provinceId && (
              <p className="text-red-500 text-xs mt-1">{errors.provinceId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شهرستان <span className="text-red-500">*</span>
            </label>
            <ComboBox
              label="شهرستان"
              apiEndpoint={`Cities?provinceId=${formData.provinceId}`}
              selectedValue={
                formData.cityId && formData.cityName
                  ? { id: formData.cityId, name: formData.cityName }
                  : null
              }
              onChange={handleCityChange}
              disabled={!formData.provinceId}
              error={errors.cityId}
            />
            {errors.cityId && (
              <p className="text-red-500 text-xs mt-1">{errors.cityId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کد پستی
            </label>
            <input
              type="text"
              placeholder="کد پستی (10 رقم)"
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              maxLength={10}
              className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 ${
                errors.postalCode ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
            )}
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
                placeholder="مثال: 02123456789"
                value={formData.telNumber}
                onChange={(e) => handleChange("telNumber", e.target.value)}
                maxLength={11}
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-16 p-2 ${
                  errors.telNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.telNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.telNumber}</p>
            )}
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              آدرس <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="  آدرس را وارد کنید (مثال: خیابان انقلاب ...) "
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              rows={3}
              className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
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