// src/app/(user)/test-results/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const BASE_URL = 'https://localhost:7086';

export default function TestResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get('id');

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // دریافت نتایج آزمون
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/WorkingMemoryResponses/${testId}`);
        setResults(response.data);
      } catch (err) {
        setError('خطا در دریافت نتایج آزمون');
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [testId]);

  // تابع خروج از سیستم
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await axios.post(`${BASE_URL}/api/v1/Auth/logout`, { refreshToken });

      // پاک کردن توکن‌ها از localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // هدایت به صفحه لاگین
      router.push('/userLogin');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  
  const goToTestSelection = () => {
    router.push('/pages/test/test-selection');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error || 'نتایجی برای نمایش وجود ندارد'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden rtl">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.png"
          alt="Background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>


      {/* Results Container */}
      <div className="relative z-10 bg-white bg-opacity-90 rounded-lg shadow-xl p-8 max-w-md w-full mx-4 my-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">نتایج آزمون</h1>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-green-600 font-bold">{results.correctAnswers}</span>
            <span className="font-medium">:پاسخ‌های صحیح</span>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-red-600 font-bold">{results.incorrectAnswers}</span>
            <span className="font-medium">:پاسخ‌های نادرست</span>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-yellow-600 font-bold">{results.unansweredTerms}</span>
            <span className="font-medium">:پاسخ داده نشده</span>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-blue-600 font-bold">{results.totalTerms}</span>
            <span className="font-medium">:کل سوالات</span>
          </div>
        </div>

        {/* دکمه‌های اقدام */}
        <div className="flex justify-between space-x-4">
          <button
            onClick={goToTestSelection}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium"
          >
            بازگشت به انتخاب آزمون
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium"
          >
            خروج از سیستم
          </button>
        </div>
      </div>
    </div>
  );
}