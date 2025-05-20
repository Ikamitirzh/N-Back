// src/app/(user)/test-selection/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const BASE_URL = 'https://localhost:7086';

export default function TestSelection() {
  const router = useRouter();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
console.log(tests)
  // دریافت لیست آزمون‌ها
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/WorkingMemoryTests`);
        setTests(response.data);

      } catch (err) {
        setError('خطا در دریافت اطلاعات آزمون‌ها');
        console.error('Error fetching tests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  // تابع تبدیل type به نام آزمون
  const getTestName = (type) => {
    switch (type) {
      case 0: return '1-back';
      case 1: return '2-back';
      case 2: return '3-back';
      default: return 'نامشخص';
    }
  };

  // تابع بررسی وضعیت آزمون
  const getTestStatus = (status) => {
    switch (status) {
      case 0: return { text: 'غیرفعال', color: 'text-gray-400', disabled: true };
      case 1: return { text: 'شروع آزمون', color: 'text-green-600', disabled: false };
      case 2: return { text: 'ادامه آزمون', color: 'text-blue-600', disabled: false };
      case 3: return { text: 'تکمیل شده', color: 'text-gray-500', disabled: true };
      default: return { text: 'نامشخص', color: 'text-gray-400', disabled: true };
    }
  };

  // تابع شروع آزمون
  const startTest = (testId, testType) => {
    router.push(`/pages/test/test-instructions/${testId}?type=${testType}`);
  };

  // مرتب کردن آزمون‌ها بر اساس order
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
          برای شروع آزمون، لطفاً سطح مورد نظر خود را انتخاب کنید و آماده چالش بشید!
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
                  className={`border rounded-lg p-4 ${status.disabled ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'}`}
                  onClick={() => !status.disabled && startTest(test.id, test.type)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg">{getTestName(test.type)}</h3>
                      <p className={`text-sm ${status.color}`}>{status.text}</p>
                    </div>
                    {!status.disabled && (
                      <button
                        className={`px-4 py-2 rounded-md ${test.status === 2 ? 'bg-blue-500' : 'bg-green-500'} text-white`}
                      >
                        {test.status === 2 ? 'ادامه' : 'شروع'}
                      </button>
                    )}
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