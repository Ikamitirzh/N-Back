// app/(admin)/test-result-details/page.jsx (یا مسیر مناسب شما)
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from 'next/image'; // برای تصویر پس‌زمینه
import { ChevronLeft, CheckCircle, XCircle, MinusCircle, RefreshCw, Eye } from "lucide-react";
import Sidebar from "../../../../components/admin/Sidebar"; // مسیر Sidebar خودتان
import Header from "../../../../components/admin/Header";   // مسیر Header خودتان
import { useAuth } from "../../../../hooks/useAuth";     // مسیر useAuth خودتان

const BASE_URL = "https://localhost:7086"; // آدرس بک‌اند شما

// کامپوننت برای نمایش یک آیتم پاسخ در لیست
const ResponseItem = ({ item, index }) => {
  const getStatusClassesAndContent = () => {
    if (item.isAnswerCorrect === true) {
      return { 
        text: "text-green-600", 
        bg: "bg-green-50 hover:bg-green-100", 
        icon: <CheckCircle size={18} className="ml-1.5" />, // کمی فاصله بیشتر برای آیکون
        label: "درست" 
      };
    } else if (item.isAnswerCorrect === false) {
      return { 
        text: "text-red-600", 
        bg: "bg-red-50 hover:bg-red-100", 
        icon: <XCircle size={18} className="ml-1.5" />, 
        label: "نادرست" 
      };
    } else {
      return { 
        text: "text-yellow-600", 
        bg: "bg-yellow-50 hover:bg-yellow-100", 
        icon: <MinusCircle size={18} className="ml-1.5" />, 
        label: "بی‌پاسخ" 
      };
    }
  };
  const status = getStatusClassesAndContent();

  return (
    <div 
      className={`flex items-center p-3 rounded-lg mb-2.5 shadow-sm text-sm ${status.bg} transition-all duration-300 ease-out opacity-0 animate-fade-in-up`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* شماره سوال (راست) */}
      <div className="w-20 text-right font-medium text-gray-700 pr-1 sm:pr-2">
        سوال {item.order !== undefined ? item.order : index + 1}
      </div>

      {/* وضعیت (وسط) */}
      <div className={`flex-grow flex items-center justify-center font-semibold ${status.text}`}>
        {status.icon}
        <span>{status.label}</span>
      </div>

      {/* زمان پاسخ (چپ) */}
      <div className="w-28 text-left text-gray-600 pl-1 sm:pl-2">
        {item.responseTime != null ? `${item.responseTime} ثانیه` : '-'}
      </div>
    </div>
  );
};

// کامپوننت برای نمودار دایره‌ای کامل دقت
const AccuracyDonutChart = ({ userPercent = 0, totalPercent = 0, userName = "کاربر" }) => {
  const radius = 60;
  const strokeWidthOuter = 20; // ضخامت نمودار بیرونی (میانگین کل)
  const strokeWidthInner = 16; // ضخامت نمودار داخلی (کاربر)
  const innerRadius = radius - (strokeWidthOuter / 2) - (strokeWidthInner / 2) - 2; // فاصله بین دو نمودار

  const circumferenceOuter = 2 * Math.PI * radius;
  const circumferenceInner = 2 * Math.PI * innerRadius;

  const userOffset = circumferenceInner * (1 - userPercent / 100);
  const totalOffset = circumferenceOuter * (1 - totalPercent / 100);

  const [animatedUserOffset, setAnimatedUserOffset] = useState(circumferenceInner);
  const [animatedTotalOffset, setAnimatedTotalOffset] = useState(circumferenceOuter);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedUserOffset(userOffset);
      setAnimatedTotalOffset(totalOffset);
    }, 100); // تاخیر کوچک برای شروع انیمیشن
    return () => clearTimeout(timer);
  }, [userOffset, totalOffset, circumferenceInner, circumferenceOuter]);

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 bg-white rounded-xl shadow-lg h-full">
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1 text-center">
        میانگین پاسخگویی در این آزمون
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 text-center">
        مقایسه عملکرد <span className="font-bold text-indigo-600">{userName}</span> با میانگین کل
      </p>
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52"> {/* اندازه دایره */}
        {/* دایره پس‌زمینه برای میانگین کل */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} fill="transparent" stroke="#e5e7eb" strokeWidth={strokeWidthOuter} />
          {/* دایره میانگین کل */}
          <circle
            cx="70" cy="70" r={radius}
            fill="transparent"
            stroke="#34d399" // رنگ میانگین کل (سبز)
            strokeWidth={strokeWidthOuter}
            strokeDasharray={circumferenceOuter}
            strokeDashoffset={animatedTotalOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        {/* دایره کاربر (جلوتر و کمی کوچکتر) */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={innerRadius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidthInner} />
          <circle
            cx="70" cy="70" r={innerRadius}
            fill="transparent"
            stroke="#ec4899" // رنگ کاربر (صورتی)
            strokeWidth={strokeWidthInner}
            strokeDasharray={circumferenceInner}
            strokeDashoffset={animatedUserOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s' }} // تاخیر برای شروع
          />
        </svg>
        {/* نمایش درصد کاربر در مرکز */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="block text-xl sm:text-2xl font-bold text-[#ec4899]">{userPercent}%</span>
            
        </div>
      </div>
      <div className="flex justify-around w-full mt-4 sm:mt-6 text-xs sm:text-sm">
        <div className="flex items-center">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ec4899] mr-1.5 sm:mr-2"></span>
          <span>{userName}: <span className="font-bold">{userPercent}%</span></span>
        </div>
        <div className="flex items-center">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#34d399] mr-1.5 sm:mr-2"></span>
          <span>میانگین کل: <span className="font-bold">{totalPercent}%</span></span>
        </div>
      </div>
    </div>
  );
};


export default function AdminTestResultDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("userTestSessionId"); 
  const { authApiClient } = useAuth();

  const [responses, setResponses] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loadingData, setLoadingData] = useState(true); // یک state لودینگ کلی
  const [error, setError] = useState('');
  
  const fetchData = useCallback(async () => {
    if (!sessionId) {
      setError("شناسه جلسه آزمون نامعتبر است.");
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    setError('');

    try {
      const responsesPromise = authApiClient.get(`${BASE_URL}/api/v1/admin/WorkingMemoryResponses/${sessionId}`);
      const chartPromise = authApiClient.get(`${BASE_URL}/api/v1/admin/WorkingMemoryResponses/${sessionId}/accuracy-chart`);

      const [responsesResult, chartResult] = await Promise.all([responsesPromise, chartPromise]);
      
      setResponses(responsesResult.data || []);
      setChartData(chartResult.data || null);

    } catch (err) {
      console.error("Error fetching test result details:", err);
      setError("خطا در دریافت جزئیات نتایج آزمون. لطفاً از صحت شناسه جلسه اطمینان حاصل کنید یا با پشتیبانی تماس بگیرید.");
      setResponses([]);
      setChartData(null);
    } finally {
      setLoadingData(false);
    }
  }, [authApiClient, sessionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex min-h-screen bg-gray-100 text-right" dir="rtl">
      <Header title="پنل ادمین - جزئیات نتایج" />
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 md:p-8 mr-0 md:mr-64 mt-16 md:mt-20"> {/* تنظیم مارجین برای هدر و سایدبار */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            جزئیات آزمون {chartData?.userFullName ? ` برای ${chartData.userFullName}` : ''}
          </h2>
          <button
            onClick={() => router.push('/pages/admin/result-exam')} // مسیر صفحه لیست اصلی نتایج
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg shadow hover:shadow-md transition-colors duration-150"
          >
            <ChevronLeft size={16} className="ml-1.5 transform rotate-180" />
            بازگشت به لیست نتایج
          </button>
        </div>

        {loadingData ? (
          <div className="flex justify-center items-center h-[calc(100vh-12rem)]"> {/* ارتفاع برای لودینگ */}
            <RefreshCw size={40} className="text-blue-500 animate-spin" />
            <p className="mr-3 text-gray-600">در حال بارگذاری اطلاعات...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-6 bg-red-100 rounded-lg shadow-md border border-red-200">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* بخش نمودار دقت (چپ در دسکتاپ، بالا در موبایل) */}
            <div className="lg:col-span-1 order-first lg:order-last">
              {chartData ? (
                <AccuracyDonutChart
                  userName={chartData.userFullName || "کاربر"}
                  userPercent={chartData.userAccuracyPercent}
                  totalPercent={chartData.totalAccuracyPercent}
                />
              ) : (
                <div className="p-6 bg-white rounded-xl shadow-lg h-full flex items-center justify-center text-gray-500 min-h-[200px]">
                  داده‌ای برای نمودار یافت نشد.
                </div>
              )}
            </div>

            {/* بخش لیست پاسخ‌ها (راست در دسکتاپ، پایین در موبایل) */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700">لیست پاسخ‌ها</h3>
                {responses.length > 0 && (
                    <div className="text-xs sm:text-sm text-gray-500">
                    تعداد کل: {responses.length}
                    </div>
                )}
              </div>
              {responses.length > 0 ? (
                <div className="max-h-[calc(100vh-22rem)] sm:max-h-[calc(100vh-20rem)] md:max-h-[500px] lg:max-h-[calc(100vh-20rem)] overflow-y-auto custom-scrollbar pr-0.5 sm:pr-1">
                    {responses.map((item, index) => (
                      <ResponseItem key={item.oder !== undefined ? item.oder : `response-${index}`} item={item} index={index} />
                    ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10 min-h-[150px] flex items-center justify-center">پاسخی برای نمایش وجود ندارد.</div>
              )}
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px; /* کمی باریک‌تر برای ظاهر بهتر */
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc; /* bg-slate-50 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; /* bg-slate-300 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; /* bg-slate-400 */
        }
      `}</style>
    </div>
  );
}