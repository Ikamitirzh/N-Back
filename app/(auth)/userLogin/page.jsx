'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "../../../hooks/useAuth";
import Image from 'next/image';
import ComboBox from "../../../components/ComboBoxUser";

export default function StudentLogin() {
  const { 
    studentLogin, 
    authApiClient, 
    isLoading: authLoading,
    user
  } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    phoneNumber: '',
    firstName: '',
    lastName: '',
    age: '',
    gender: 0,
    isRightHanded: true,
    provinceId: '',
    cityId: '',
    schoolId: '',
    provinceName: '',
    cityName: '',
  });

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    phoneNumber: '',
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    schoolId: '',
    provinceId: '',
    cityId: ''
  });

  // Redirect if user is already logged in
  // useEffect(() => {
  //   if (!authLoading && user) {
  //     router.push('/pages/test/test-selection');
  //   }
  // }, [user, authLoading, router]);

  // Fetch schools when city changes
  useEffect(() => {
    const fetchSchools = async () => {
      if (formData.cityId) {
        try {
          const response = await authApiClient.get('/api/v1/Schools', {
            params: { cityId: formData.cityId },
          });
          setSchools(response.data.items || response.data);
        } catch (error) {
          console.error("Error fetching schools:", error);
          setSchools([]);
        }
      }
    };
    fetchSchools();
  }, [formData.cityId, authApiClient]);

  // اعتبارسنجی‌ها
  const validatePhoneNumber = (phone) => /^09\d{9}$/.test(phone);
  const validateAge = (age) => age >= 5 && age <= 100;
  const validateTextInput = (value) => !/\d/.test(value);
  const validateNumericInput = (value) => /^\d*$/.test(value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // اعتبارسنجی فیلدهای متنی (نام و نام خانوادگی)
    if (['firstName', 'lastName'].includes(name)) {
      if (!validateTextInput(value)) return;
      setErrors({...errors, [name]: ''});
    }
    
    // اعتبارسنجی شماره موبایل
    if (name === 'phoneNumber') {
      if (!validateNumericInput(value)) return;
      if (value.length > 11) return;
      setErrors({...errors, phoneNumber: value.length === 11 && !validatePhoneNumber(value) ? 
        'شماره موبایل نامعتبر است' : ''});
    }
    
    // اعتبارسنجی سن
    if (name === 'age') {
      if (!validateNumericInput(value)) return;
      if (value.length > 3) return;
      setErrors({...errors, age: value && !validateAge(value) ? 
        'سن باید بین ۵ تا ۱۰۰ سال باشد' : ''});
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (province) => {
    setFormData(prev => ({
      ...prev,
      provinceId: province.id,
      provinceName: province.name,
      cityId: '',
      cityName: '',
      schoolId: '',
    }));
    setSchools([]);
    setErrors({...errors, provinceId: ''});
  };

  const handleCityChange = (city) => {
    setFormData(prev => ({
      ...prev,
      cityId: city.id,
      cityName: city.name,
      schoolId: '',
    }));
    setErrors({...errors, cityId: ''});
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // اعتبارسنجی نام
    if (!formData.firstName) {
      newErrors.firstName = 'نام الزامی است';
      isValid = false;
    } else if (!validateTextInput(formData.firstName)) {
      newErrors.firstName = 'نام نمی‌تواند شامل عدد باشد';
      isValid = false;
    }

    // اعتبارسنجی نام خانوادگی
    if (!formData.lastName) {
      newErrors.lastName = 'نام خانوادگی الزامی است';
      isValid = false;
    } else if (!validateTextInput(formData.lastName)) {
      newErrors.lastName = 'نام خانوادگی نمی‌تواند شامل عدد باشد';
      isValid = false;
    }

    // اعتبارسنجی شماره موبایل
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'شماره موبایل الزامی است';
      isValid = false;
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'شماره موبایل باید 11 رقمی و با 09 شروع شود';
      isValid = false;
    }

    // اعتبارسنجی سن
    if (!formData.age) {
      newErrors.age = 'سن الزامی است';
      isValid = false;
    } else if (!validateAge(formData.age)) {
      newErrors.age = 'سن باید بین ۵ تا ۱۰۰ سال باشد';
      isValid = false;
    }

    // اعتبارسنجی استان و شهر
    if (!formData.provinceId) {
      newErrors.provinceId = 'انتخاب استان الزامی است';
      isValid = false;
    }
    if (!formData.cityId) {
      newErrors.cityId = 'انتخاب شهر الزامی است';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        phoneNumber: formData.phoneNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: parseInt(formData.age),
        gender: parseInt(formData.gender),
        isRightHanded: formData.isRightHanded === 'true',
        schoolId: formData.schoolId ? parseInt(formData.schoolId) : 0,
      };

      await studentLogin(payload);
      router.push('/pages/test/test-selection');
    } catch (err) {
      setErrors({...errors, form: err.response?.data?.message || 'خطا در ورود. لطفاً اطلاعات را بررسی کنید.'});
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.png"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          quality={100}
        />
      </div>

      {/* Main Form Container */}
      <div className="relative z-10 bg-white bg-opacity-90 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 my-8 h-auto">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">ورود به آزمون</h1>

        {/* Error display */}
        {errors.form && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {errors.form}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                نام <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="مثال: علی"
                className={`w-full px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-blue-500 text-sm ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                نام خانوادگی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="مثال: اکبری"
                className={`w-full px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-blue-500 text-sm ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Phone Number and Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                شماره موبایل <span className="text-red-500">*</span>
              </label>
              <div className='relative'>
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                ۹۸+
              </span>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="مثال: 09123456789"
                className={`w-full px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-blue-500 text-sm pl-15 ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              )}
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                سن <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                placeholder="مثال: 10"
                value={formData.age}
                onChange={handleChange}
                min="5"
                max="100"
                className={`w-full px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-blue-500 text-sm ${
                  errors.age ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1">{errors.age}</p>
              )}
            </div>
          </div>

          {/* Province and City Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ComboBox
                label="استان"
                apiEndpoint="Provinces"
                selectedValue={
                  formData.provinceId
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
              <ComboBox
                label="شهرستان"
                apiEndpoint="Cities"
                selectedValue={
                  formData.cityId ? { id: formData.cityId, name: formData.cityName } : null
                }
                onChange={handleCityChange}
                disabled={!formData.provinceId}
                params={{ provinceId: formData.provinceId }}
                error={errors.cityId}
              />
              {errors.cityId && (
                <p className="text-red-500 text-xs mt-1">{errors.cityId}</p>
              )}
            </div>
          </div>

          {/* School Selection */}
          <div>
            <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-1">
              نام مدرسه:
            </label>
            <select
              id="schoolId"
              name="schoolId"
              value={formData.schoolId}
              onChange={handleChange}
              disabled={!formData.cityId || schools.length === 0}
              className={`w-full px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-blue-500 text-sm ${
                errors.schoolId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">
                {formData.cityId ? 'انتخاب کنید' : 'ابتدا شهر را انتخاب کنید'}
              </option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
            {errors.schoolId && (
              <p className="text-red-500 text-xs mt-1">{errors.schoolId}</p>
            )}
          </div>

          {/* Gender and Handedness Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">جنسیت <span className="text-red-500">*</span>:</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={0}
                    checked={formData.gender === 0 || formData.gender === "0"}
                    onChange={handleChange}
                    className="text-blue-600 h-4 w-4"
                  />
                  <span className="mr-1 text-sm">مرد</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={1}
                    checked={formData.gender === 1 || formData.gender === "1"}
                    onChange={handleChange}
                    className="text-blue-600 h-4 w-4"
                  />
                  <span className="mr-1 text-sm">زن</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">دست غالب:</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isRightHanded"
                    value="true"
                    checked={formData.isRightHanded === true || formData.isRightHanded === 'true'}
                    onChange={handleChange}
                    className="text-blue-600 h-4 w-4"
                  />
                  <span className="mr-1 text-sm">راست</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="isRightHanded"
                    value="false"
                    checked={formData.isRightHanded === false || formData.isRightHanded === 'false'}
                    onChange={handleChange}
                    className="text-blue-600 h-4 w-4"
                  />
                  <span className="mr-1 text-sm">چپ</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition text-sm ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'در حال پردازش...' : 'ورود'}
          </button>
        </form>
      </div>

      {/* Illustration Section */}
      <div className="w-1/2 flex items-center justify-center p-4 z-10">
        <Image 
          src="/Online-test-rafiki.png" 
          alt="کاربر در حال کار" 
          width={500} 
          height={500} 
          priority
        />
      </div>
    </div>
  );
}