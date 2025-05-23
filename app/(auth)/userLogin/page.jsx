// src/app/(user)/login/page.jsx
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
  const [error, setError] = useState('');

  // اگر کاربر قبلا لاگین کرده باشد، به صفحه اصلی هدایت شود
//  useEffect(() => {
//     if (!authLoading && user) {
//       router.push('/pages/test/test-selection');
//     }
//   }, [user, authLoading, router]);

  // Fetch schools based on selected city
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      setError(err.response?.data?.message || 'خطا در ورود. لطفاً اطلاعات را بررسی کنید.');
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

      {/* Form Container */}
      <div className="relative z-10 bg-white bg-opacity-90 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 my-8 h-auto">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">ورود به آزمون</h1>

        {error && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* نام و نام خانوادگی */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                نام:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="مثال: عارفه"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                نام خانوادگی:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="مثال: غلامی"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
          </div>

          {/* شماره موبایل و سن */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                شماره موبایل:
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="مثال: ۹۷۱۲۳۴۵۶۷"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                سن:
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="5"
                max="100"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
          </div>

          {/* استان و شهرستان */}
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
                onChange={(option) => {
                  setFormData((prev) => ({
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
                  formData.cityId ? { id: formData.cityId, name: formData.cityName } : null
                }
                onChange={(option) => {
                  setFormData((prev) => ({
                    ...prev,
                    cityId: option.id,
                    cityName: option.name,
                    schoolId: '',
                  }));
                }}
                disabled={!formData.provinceId}
                params={{ provinceId: formData.provinceId }}
              />
            </div>
          </div>

          {/* مدرسه */}
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
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
          </div>

          {/* جنسیت و دست غالب */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">جنسیت:</label>
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
                    required
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

          {/* دکمه ورود */}
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