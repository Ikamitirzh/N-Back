// src/app/(user)/test-selection/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import axiosInstance from '../../../../utils/api';
import { useAuth } from '../../../../hooks/useAuth';

const BASE_URL = 'https://localhost:7086';

export default function TestSelection() {

  const router = useRouter();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { apiClient } = useAuth();

  // دریافت لیست آزمون‌ها
  useEffect(() => {
    const fetchTests = async () => {
      try {
        // استفاده از apiClient به جای axios خام
        const response = await apiClient.get('/api/v1/WorkingMemoryTests');
        setTests(response.data);
      } catch (err) {
        console.error('Error fetching tests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  // تبدیل type به نام آزمون
  const getTestName = (type) => {
    switch (type) {
      case 0: return '1-back';
      case 1: return '2-back';
      case 2: return '3-back';
      default: return 'نامشخص';
    }
  };

  // بررسی وضعیت آزمون
  const getTestStatus = (status) => {
    switch (status) {
      case 0: return { text: 'غیرفعال', color: 'text-gray-400', disabled: true };
      case 1: return { text: 'شروع آزمون', color: 'text-white', disabled: false };
      case 2: return { text: 'ادامه آزمون', color: 'text-blue-600', disabled: false };
      case 3: return { text: 'تکمیل شده', color: 'text-gray-500', disabled: true };
      default: return { text: 'نامشخص', color: 'text-gray-400', disabled: true };
    }
  };

  // شروع آزمون
  const startTest = (testId, testType) => {
    router.push(`/pages/test/test-instructions/${testId}?type=${testType}`);
  };

  // مرتب‌سازی آزمون‌ها
  const sortedTests = [...tests].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full z-10">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">انتخاب سطح آزمون</h1>
        <p className="text-center mb-8 text-gray-600">
          برای شروع آزمون، لطفاً سطح مورد نظر خود را انتخاب کنید و آماده چالش بشوید
        </p>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center mb-4">{error}</div>
        ) : (
          <div className="space-y-4">
            {sortedTests.map((test) => {
              const status = getTestStatus(test.status);
              return (
                <div
                  key={test.id}
                  onClick={() => !status.disabled && startTest(test.id, test.type)}
                  className={`border rounded-lg p-4 transition-all duration-200   ${
                    status.disabled
                      ? 'bg-gray-50 cursor-not-allowed text-black'
                      : `bg-blue-600 hover:bg-blue-800 cursor-pointer text-white`
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <h3 className="font-medium text-lg">{getTestName(test.type)}</h3>
                    <p className={`text-sm ${status.color} mt-1`}>{status.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}