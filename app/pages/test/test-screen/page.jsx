// src/app/(user)/test-screen/page.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';


const BASE_URL = 'https://localhost:7086';

export default function TestScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get('id');
  const testType = searchParams.get('type');

  const [terms, setTerms] = useState([]);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageTransition, setImageTransition] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // دریافت سوالات آزمون
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/WorkingMemoryTerms/${testId}`);
        setTerms(response.data);
        // پیدا کردن اولین سوال بدون پاسخ
        const firstUnanswered = response.data.findIndex(term => term.userResponseDetails === null);
        setCurrentTermIndex(firstUnanswered >= 0 ? firstUnanswered : 0);
      } catch (err) {
        setError('خطا در دریافت سوالات آزمون');
        console.error('Error fetching terms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, [testId]);

  // مدیریت تایمر و تغییر سوال
  useEffect(() => {
    if (loading || !terms.length) return;

    const currentTerm = terms[currentTermIndex];
    const isAnswered = currentTerm?.userResponseDetails !== null;

    // انیمیشن تغییر تصویر
    setImageTransition(true);
    const transitionTimer = setTimeout(() => setImageTransition(false), 500);

    if (!isAnswered) {
      startTimeRef.current = new Date().getTime();
      setTimeLeft(3);
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(transitionTimer);
    };
  }, [currentTermIndex, terms, loading]);

  // انصراف از آزمون
  const cancelTest = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/WorkingMemoryResponses/${testId}`);
      router.push('/pages/test/test-selection');
    } catch (err) {
      console.error('Error cancelling test:', err);
    }
  };

  // ارسال پاسخ به سرور
  const submitResponse = async (isTarget) => {
    const currentTerm = terms[currentTermIndex];
    if (!currentTerm || currentTerm.userResponseDetails !== null) return;

    const endTime = new Date().getTime();
    const responseTime = endTime - startTimeRef.current;

    try {
      await axios.post(`${BASE_URL}/api/v1/WorkingMemoryResponses/${testId}`, {
        termId: currentTerm.id,
        isTarget,
        responseTime
      });

      // به روزرسانی وضعیت محلی
      const updatedTerms = [...terms];
      updatedTerms[currentTermIndex] = {
        ...currentTerm,
        userResponseDetails: {
          id: currentTerm.id,
          isTarget,
          responseTime
        }
      };
      setTerms(updatedTerms);

      // رفتن به سوال بعدی
      goToNextTerm();
    } catch (err) {
      console.error('Error submitting response:', err);
    }
  };

  // وقتی زمان پاسخ تمام شود
  const handleTimeUp = () => {
    clearInterval(timerRef.current);
    const currentTerm = terms[currentTermIndex];
    
    if (currentTerm?.userResponseDetails === null) {
      axios.post(`${BASE_URL}/api/v1/WorkingMemoryResponses/${testId}`, {
        termId: currentTerm.id,
        responseTime: 3000 // حداکثر زمان پاسخ
      });

      // به روزرسانی وضعیت محلی
      const updatedTerms = [...terms];
      updatedTerms[currentTermIndex] = {
        ...currentTerm,
        userResponseDetails: {
          id: currentTerm.id,
          isTarget: null,
          responseTime: 3000
        }
      };
      setTerms(updatedTerms);
    }

    goToNextTerm();
  };

  // رفتن به سوال بعدی
  const goToNextTerm = () => {
    clearInterval(timerRef.current);
    
    // پیدا کردن سوال بعدی بدون پاسخ
    const nextUnanswered = terms.findIndex(
      (term, index) => index > currentTermIndex && term.userResponseDetails === null
    );

    if (nextUnanswered >= 0) {
      setCurrentTermIndex(nextUnanswered);
    } else {
      // اگر همه سوالات پاسخ داده شده‌اند
      router.push(`/pages/test/test-results?id=${testId}&type=${testType}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !terms.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error || 'سوالی برای نمایش وجود ندارد'}</p>
      </div>
    );
  }

  const currentTerm = terms[currentTermIndex];
  const isAnswered = currentTerm?.userResponseDetails !== null;
  const isFirstQuestion = currentTermIndex === 0;
  const showResponseButtons = !isFirstQuestion && !isAnswered;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 relative ">
      <div className="absolute inset-0 z-0">
              <img
                src="/background.png"
                alt="Background"
                
                className="object-cover"
                quality={100}
               
              />
            </div>
      {/* دکمه انصراف */}
      <button
        onClick={cancelTest}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
      >
        انصراف از آزمون
      </button>

      {/* نوار پیشرفت زمان */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6 max-w-md z-10">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / 3) * 100}%` }}
        ></div>
      </div>

      {/* نمایش تصویر سوال با انیمیشن */}
      <div className="flex justify-center mb-8 h-64 z-10">
        {currentTerm.picturePath && (
          <div className={`relative w-full max-w-md ${imageTransition ? 'animate-pulse' : ''}`}>
            <img
              src={`${BASE_URL}/${currentTerm.picturePath}`}
              alt="تصویر سوال"
              width={300}
              className={`object-contain transition-opacity duration-500 ${
                imageTransition ? 'opacity-50' : 'opacity-100'
              }`}
             
            />
          </div>
        )}
      </div>

      {/* دکمه‌های پاسخ (فقط اگر پاسخ داده نشده و سوال اول نیست) */}
      {showResponseButtons && (
        <div className="flex justify-center space-x-4 mb-6 z-10">
          <button
            onClick={() => submitResponse(false)}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium"
          >
            متفاوت
          </button>
          <button
            onClick={() => submitResponse(true)}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium"
          >
            مشابه
          </button>
        </div>
      )}

      {/* نمایش وضعیت برای سوال اول یا سوالات پاسخ داده شده */}
      {(isFirstQuestion || isAnswered) && (
        <div className="text-center mb-6 z-10">
          <p className="text-gray-600">
            {isFirstQuestion
              ? 'این اولین تصویر است. تصویر بعدی را با این مقایسه کنید.'
              : 'پاسخ شما ثبت شد. تصویر بعدی به زودی نمایش داده می‌شود.'}
          </p>
        </div>
      )}
    </div>
  );
}