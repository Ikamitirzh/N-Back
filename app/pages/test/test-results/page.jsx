// src/app/(user)/test-results/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Image from 'next/image';
import { useAuth } from '../../../../hooks/useAuth';
const BASE_URL = 'https://localhost:7086';

export default function TestResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get('id');
  const { authApiClient} = useAuth();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await authApiClient.get(`${BASE_URL}/api/v1/WorkingMemoryResponses/${testId}`);
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

  
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await authApiClient.post(`${BASE_URL}/api/v1/Auth/logout`, { refreshToken });

     
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      
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
   // 'use client';
// import Image from 'next/image';
// ... (سایر ایمپورت‌ها)

// return (
<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden rtl p-4 sm:p-6"> {/* پدینگ کلی صفحه، در موبایل p-4 و در صفحات بزرگتر sm:p-6 */}
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
  {/* موبایل: w-full (تا جایی که max-w اجازه دهد)، بدون مارجین افقی اضافه (به پدینگ والد تکیه می‌کند)
    دسکتاپ (sm به بالا): همچنان w-full اما با max-w بزرگتر و امکان داشتن مارجین افقی اگر max-w از عرض والد کمتر شود.
  */}
  <div className="relative z-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg my-8"> {/* افزایش پدینگ داخلی، و max-width ریسپانسیو */}
    <h1 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800">نتایج آزمون</h1>

    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8"> {/* فاصله بین آیتم‌ها و مارجین پایین ریسپانسیو */}
      {/* کلاس font-larg در کد شما وجود داشت، اگر کلاس سفارشی است که تعریف کرده‌اید، آن را نگه دارید. 
          اگر منظورتان فونت بزرگتر بوده، از کلاس‌های Tailwind مثل text-base, text-lg استفاده کنید.
          من فرض می‌کنم font-larg یک کلاس سفارشی است یا با text-md/text-lg جایگزین می‌شود.
          همچنین mx-15 استاندارد نیست، آن را با px یا mx استاندارد جایگزین کردم.
      */}
      <div className="flex justify-between items-center px-2 sm:px-0 pb-2 border-b border-gray-200"> {/* اضافه کردن border-b برای جداسازی بهتر */}
        <span className="text-sm sm:text-base text-gray-700">پاسخ‌های صحیح:</span>
        <span className="text-green-600 text-sm sm:text-base font-bold">{results.correctAnswers}</span>
      </div>

      <div className="flex justify-between items-center px-2 sm:px-0 pb-2 border-b border-gray-200">
        <span className="text-sm sm:text-base text-gray-700">پاسخ‌های نادرست:</span>
        <span className="text-red-600 text-sm sm:text-base font-bold">{results.incorrectAnswers}</span>
      </div>

      <div className="flex justify-between items-center px-2 sm:px-0 pb-2 border-b border-gray-200">
        <span className="text-sm sm:text-base text-gray-700">پاسخ داده نشده:</span>
        <span className="text-yellow-600 text-sm sm:text-base font-bold">{results.unansweredTerms}</span>
      </div>

      <div className="flex justify-between items-center px-2 sm:px-0 pb-2">
        <span className="text-sm sm:text-base text-gray-700">کل سوالات:</span>
        <span className="text-blue-600 text-sm sm:text-base font-bold">{results.totalTerms}</span>
      </div>
    </div>
    
    {/* دکمه‌ها: در موبایل ممکن است زیر هم بهتر باشند یا با عرض کامل */}
    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4"> {/* در موبایل ستونی، در sm به بالا ردیفی */}
      <button
        onClick={goToTestSelection}
        className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium text-sm sm:text-base transition-colors"
      >
        بازگشت به انتخاب آزمون
      </button>
      <button
        onClick={handleLogout}
        className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium text-sm sm:text-base transition-colors"
      >
        خروج از سیستم
      </button>
    </div>
  </div>
</div>
  );
}