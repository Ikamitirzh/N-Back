// src/app/(user)/test-screen/page.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { useAuth } from '../../../../hooks/useAuth';

const BASE_URL = 'https://localhost:7086';

export default function TestScreen() {
  const { authApiClient} = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get('id');
  const testType = searchParams.get('type');

  const [terms, setTerms] = useState([]);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageTransition, setImageTransition] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const timeUpHandled = useRef(false); // افزودن یک ref برای پیگیری اجرای handleTimeUp

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await authApiClient.get(`${BASE_URL}/api/v1/WorkingMemoryTerms/${testId}`);
        setTerms(response.data);

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


  useEffect(() => {
    if (loading || !terms.length) return;

    const currentTerm = terms[currentTermIndex];
    const isAnswered = currentTerm?.userResponseDetails !== null;

    setImageTransition(true);
    const transitionTimer = setTimeout(() => setImageTransition(false), 500);
    timeUpHandled.current = false; // ریست کردن فلگ در هر بار تغییر currentTermIndex

    if (!isAnswered) {
      startTimeRef.current = new Date().getTime();
      setTimeLeft(3);

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1 && !timeUpHandled.current) {
            timeUpHandled.current = true; // علامت بزنید که handleTimeUp اجرا شده
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


  const cancelTest = async () => {
    try {
      await authApiClient.delete(`${BASE_URL}/api/v1/WorkingMemoryResponses/${testId}`);
      router.push('/pages/test/test-selection');
    } catch (err) {
      console.error('Error cancelling test:', err);
    }
  };


  const submitResponse = async (isTarget) => {
    const currentTerm = terms[currentTermIndex];
    if (!currentTerm || currentTerm.userResponseDetails !== null) return;

    const endTime = new Date().getTime();
    const responseTime = endTime - startTimeRef.current;

    try {
      await authApiClient.post(`${BASE_URL}/api/v1/WorkingMemoryResponses/${testId}`, {
        termId: currentTerm.id,
        isTarget,
        responseTime
      });

      console.log(`current term answer: ${currentTerm.id}`)
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


      goToNextTerm();
    } catch (err) {
      console.error('Error submitting response:', err);
    }
  };


  const handleTimeUp = () => {
    clearInterval(timerRef.current);
    const currentTerm = terms[currentTermIndex];
    console.log(`currentTerm ${currentTerm.userResponseDetails}`)
    if (currentTerm?.userResponseDetails === null) {
      authApiClient.post(`${BASE_URL}/api/v1/WorkingMemoryResponses/${testId}`, {
        termId: currentTerm.id,
        responseTime: 3000
      });
      console.log(`current term time out: ${currentTerm.id}`)


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


  const goToNextTerm = () => {
    clearInterval(timerRef.current);


    const nextUnanswered = terms.findIndex(
      (term, index) => index > currentTermIndex && term.userResponseDetails === null
    );

    if (nextUnanswered >= 0) {
      setCurrentTermIndex(nextUnanswered);
    } else {

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
              className="w-full h-full object-cover"
            />

          </div>

      <button
        onClick={cancelTest}
        className="absolute top-4 right-4 px-4 py-2    text-red-600 rounded-md text-sm"
      >
        انصراف از آزمون
      </button>


      <div className="w-full bg-gray-200 rounded-full h-4 mb-6 max-w-md z-10">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${((timeLeft-1) / 2) * 100}%` }}
        ></div>
      </div>


      <div className="flex justify-center mb-8 h-64 z-10">
        {currentTerm.picturePath && (
          <div className={`relative w-full max-w-md ${imageTransition ? 'animate-pulse' : ''}`}>
            <img
              src={`${BASE_URL}/${currentTerm.picturePath}`}
              alt="تصویر سوال"
              width={340}
              className={`object-contain transition-opacity duration-500 ${
                imageTransition ? 'opacity-50' : 'opacity-100'
              }`}

            />
          </div>
        )}
      </div>


      {showResponseButtons && (
        <div className="flex justify-center space-x-4 mb-6 z-10 mt-5">
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