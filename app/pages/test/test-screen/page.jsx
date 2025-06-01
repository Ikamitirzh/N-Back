"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../hooks/useAuth";

const BASE_URL = "https://localhost:7086";

export default function TestScreen() {
  const { authApiClient } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = Number(searchParams.get("id"));
  const testType = searchParams.get("type");
  const testStatus = searchParams.get("status");

  const answeredTermIdsRef = useRef(new Set());
  const [terms, setTerms] = useState([]);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageTransition, setImageTransition] = useState(false);
  const [testStatusData, setTestStatusData] = useState(null);
  const [currentBlock, setCurrentBlock] = useState(1);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const timeUpHandled = useRef(false);
  const sessionCreated = useRef(false);

  // بارگذاری اولیه و دریافت داده‌ها
  useEffect(() => {
    const fetchTestStatus = async () => {
      try {
        const response = await authApiClient.get("/api/v1/WorkingMemoryTests");
        const test = response.data.find((item) => item.id === testId);
        setTestStatusData(test);
        return test?.status;
      } catch (err) {
        console.error("Error fetching test status:", err);
        throw err;
      }
    };

    const initializeTest = async () => {
      try {
        setLoading(true);
        const currentStatus = await fetchTestStatus();

        if (currentStatus === 1 && !sessionCreated.current) {
          sessionCreated.current = true;
          try {
            await authApiClient.post(`${BASE_URL}/api/v1/UserTestSessions/${testId}`);
            console.log("Session created");
            await fetchTestStatus();
          } catch (sessionError) {
            console.error("Error creating session:", sessionError);
          }
        }

        await fetchTerms();
      } catch (err) {
        setError("خطا در دریافت اطلاعات آزمون");
        console.error("Error initializing test:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTerms = async () => {
      try {
        const termsResponse = await authApiClient.get(
          `${BASE_URL}/api/v1/WorkingMemoryTerms/${testId}`
        );
        setTerms(termsResponse.data);
        setCurrentBlock(1);
        const firstUnanswered = termsResponse.data.findIndex(
          (term) => term.userResponseDetails === null
        );
        setCurrentTermIndex(firstUnanswered >= 0 ? firstUnanswered : 0);
      } catch (err) {
        setError("خطا در دریافت سوالات آزمون");
        console.error("Error fetching terms:", err);
      }
    };

    if (testId) {
      initializeTest();
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [testId]);

  // مدیریت تایمر و انتقال تصویر
  useEffect(() => {
    if (loading || !terms.length) return;

    const currentTerm = terms[currentTermIndex];
    const isAnswered = currentTerm?.userResponseDetails !== null;

    setImageTransition(true);
    const transitionTimer = setTimeout(() => setImageTransition(false), 500);
    timeUpHandled.current = false;

    if (!isAnswered) {
      startTimeRef.current = new Date().getTime();
      setTimeLeft(3);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1 && !timeUpHandled.current) {
            timeUpHandled.current = true;
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

  // بررسی تکمیل آزمون
  const checkTestCompletion = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await authApiClient.get(
        `${BASE_URL}/api/v1/UserTestSessions/${testId}`
      );

      if (response.data.isCompleted) {
        if (testType === "2") {
          router.push(`/pages/test/congratulations?id=${testId}&type=${testType}`);
        } else {
          router.push(`/pages/test/test-results?id=${testId}&type=${testType}`);
        }
      } else {
        const newTermsWereLoaded = await fetchMoreTerms();
        if (!newTermsWereLoaded) {
          const finalStatusResponse = await authApiClient.get(
            `${BASE_URL}/api/v1/UserTestSessions/${testId}`
          );
          if (finalStatusResponse.data.isCompleted) {
            router.push(`/pages/test/test-results?id=${testId}&type=${testType}`);
          } else {
            setError(
              "آزمون به پایان رسیده اما سرور هنوز وضعیت آن را نهایی نکرده است. لطفاً چند لحظه صبر کنید و یا با پشتیبانی تماس بگیرید."
            );
          }
        }
      }
    } catch (err) {
      console.error("Error in checkTestCompletion:", err);
      if (
        err.response?.data?.errors?.some(
          (e) => e.code === "Test_Result_Unavailable_For_Active_Session"
        )
      ) {
        setError("نتیجه آزمون هنوز در دسترس نیست. ممکن است پردازش آزمون هنوز کامل نشده باشد.");
      } else {
        setError("خطا در بررسی وضعیت تکمیل آزمون.");
      }
    } finally {
      setLoading(false);
    }
  };

  // دریافت سوالات بیشتر
  const fetchMoreTerms = async () => {
    let hasMoreAnswerableTerms = false;
    try {
      setLoading(true);
      setError("");
      const termsResponse = await authApiClient.get(
        `${BASE_URL}/api/v1/WorkingMemoryTerms/${testId}`
      );

      if (termsResponse.data?.length > 0) {
        setTerms(termsResponse.data);
        setCurrentBlock((prev) => prev + 1);
        const firstUnanswered = termsResponse.data.findIndex(
          (term) => term.userResponseDetails === null
        );
        if (firstUnanswered >= 0) {
          setCurrentTermIndex(firstUnanswered);
          hasMoreAnswerableTerms = true;
        } else {
          setTerms([]);
        }
      } else {
        setTerms([]);
      }
    } catch (err) {
      console.error("Error fetching more terms:", err);
      setError("خطا در دریافت سوالات بیشتر آزمون.");
    } finally {
      setLoading(false);
    }
    return hasMoreAnswerableTerms;
  };

  // لغو آزمون
  const cancelTest = async () => {
    try {
      await authApiClient.delete(`${BASE_URL}/api/v1/UserTestSessions/${testId}`);
      router.push("/pages/test/test-selection");
    } catch (err) {
      console.error("Error cancelling test:", err);
    }
  };

  // ارسال پاسخ
  const submitResponse = async (isTarget) => {
    const currentTerm = terms[currentTermIndex];
    if (!currentTerm || answeredTermIdsRef.current.has(currentTerm.id)) return;

    answeredTermIdsRef.current.add(currentTerm.id);

    const endTime = new Date().getTime();
    const responseTime = endTime - startTimeRef.current;

    try {
      const finalIsTarget =
        currentTermIndex === 0 && currentBlock === 1 ? false : isTarget;
      await authApiClient.post(`${BASE_URL}/api/v1/WorkingMemoryResponses/${testId}`, {
        termId: currentTerm.id,
        isTarget: finalIsTarget,
        responseTime,
      });

      const updatedTerms = [...terms];
      updatedTerms[currentTermIndex] = {
        ...currentTerm,
        userResponseDetails: {
          id: currentTerm.id,
          isTarget: finalIsTarget,
          responseTime,
        },
      };
      setTerms(updatedTerms);
      await goToNextTerm();
    } catch (err) {
      console.error("Error submitting response:", err);
    }
  };

  // مدیریت اتمام زمان
  const handleTimeUp = async () => {
    clearInterval(timerRef.current);
    const currentTerm = terms[currentTermIndex];

    if (currentTerm?.userResponseDetails === null) {
      try {
        const finalIsTarget =
          currentTermIndex === 0 && currentBlock === 1 ? false : null;
        await authApiClient.post(`${BASE_URL}/api/v1/WorkingMemoryResponses/${testId}`, {
          termId: currentTerm.id,
          isTarget: finalIsTarget,
          responseTime: 3000,
        });

        const updatedTerms = [...terms];
        updatedTerms[currentTermIndex] = {
          ...currentTerm,
          userResponseDetails: {
            id: currentTerm.id,
            isTarget: finalIsTarget,
            responseTime: 3000,
          },
        };
        setTerms(updatedTerms);
      } catch (err) {
        console.error("Error handling time up:", err);
      }
    }

    await goToNextTerm();
  };

  // رفتن به سوال بعدی
  const goToNextTerm = async () => {
    clearInterval(timerRef.current);

    const nextUnanswered = terms.findIndex(
      (term, index) => index > currentTermIndex && term.userResponseDetails === null
    );

    if (nextUnanswered >= 0) {
      setCurrentTermIndex(nextUnanswered);
    } else {
      await checkTestCompletion();
    }
  };

  // تعریف متغیرها قبل از استفاده
  const currentTerm = terms[currentTermIndex] || {};
  const isAnswered = currentTerm?.userResponseDetails !== null;
  const isFirstQuestionInFirstBlock = currentTermIndex === 0 && currentBlock === 1;
  const showResponseButtons = !isAnswered && !isFirstQuestionInFirstBlock;
  const isDesktop = typeof window !== "undefined" && window.innerWidth > 768;

  // مدیریت ورودی کیبورد
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!showResponseButtons) return;

      // دیباگ: چک کردن کلیدهای فشرده‌شده
      console.log("Key pressed:", event.key);

      if (event.key.toLowerCase() === "c") {
        console.log("Submitting response: متفاوت");
        submitResponse(false); // متفاوت
      } else if (event.key.toLowerCase() === "x") {
        console.log("Submitting response: مشابه");
        submitResponse(true); // مشابه
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showResponseButtons, submitResponse]);

  // رندر صفحه
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
        <p className="text-red-500">{error || "سوالی برای نمایش وجود ندارد"}</p>
        <button
          onClick={() => router.push("/pages/test/test-selection")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          بازگشت به صفحه انتخاب آزمون
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 relative overflow-hidden">
      {/* تصویر پس‌زمینه */}
      <div className="absolute inset-0 z-0">
        <img
          src="/background.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* دکمه انصراف */}
      <button
        onClick={cancelTest}
        className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white/80 backdrop-blur-sm text-red-500 hover:text-red-700 hover:bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md sm:rounded-lg shadow-md font-medium z-20 transition-all duration-150 ease-in-out"
      >
        انصراف از آزمون
      </button>

      {/* کارت اصلی آزمون */}
      <div className="relative z-10 w-full max-w-lg xl:max-w-xl bg-white/95 backdrop-blur-lg shadow-2xl rounded-xl sm:rounded-2xl p-6 pt-8 sm:p-8 space-y-6 sm:space-y-8 text-center">
        {/* نوار پیشرفت (تایمر) */}
        <div className="w-full">
          <div className="text-sm text-gray-600 mb-1 text-right">زمان باقیمانده</div>
          <div className="bg-gray-200 rounded-full h-5 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-linear flex items-center justify-end pr-2"
              style={{ width: `${((timeLeft - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* محفظه تصویر */}
        <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden shadow-lg group relative">
          {currentTerm.picturePath ? (
            <img
              src={`${BASE_URL}/${currentTerm.picturePath}`}
              alt="تصویر سوال"
              className={`max-w-full max-h-full object-contain transition-all duration-500 ease-in-out group-hover:scale-105 ${
                imageTransition ? "opacity-20 scale-90" : "opacity-100 scale-100"
              }`}
            />
          ) : (
            <div className="text-gray-400 p-5">
              تصویری برای نمایش وجود ندارد یا در حال بارگذاری است...
            </div>
          )}
          {imageTransition && (
            <div className="absolute inset-0 flex items-center justify-center"></div>
          )}
        </div>

        {/* دکمه‌های پاسخ */}
        {showResponseButtons && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => submitResponse(false)}
              className="w-full px-6 py-3.5 sm:py-4 bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg hover:from-rose-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-300/50 transform transition-all duration-150 ease-in-out hover:-translate-y-0.5 active:scale-95 font-semibold text-base sm:text-lg"
            >
              متفاوت
            </button>
            <button
              onClick={() => submitResponse(true)}
              className="w-full px-6 py-3.5 sm:py-4 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-300/50 transform transition-all duration-150 ease-in-out hover:-translate-y-0.5 active:scale-95 font-semibold text-base sm:text-lg"
            >
              مشابه
            </button>
          </div>
        )}

        {/* انیمیشن کیبورد برای سوال اول (فقط توی دسکتاپ) */}
        {isFirstQuestionInFirstBlock && isDesktop && (
          <div className="flex justify-center space-x-6 mt-4">
            <div className="keyboard-key">
              <span className="key-label">X</span>
              <span className="key-action">مشابه</span>
            </div>
            <div className="keyboard-key">
              <span className="key-label">C</span>
              <span className="key-action">متفاوت</span>
            </div>
          </div>
        )}

        {/* متن راهنما */}
        {(isFirstQuestionInFirstBlock || isAnswered) && (
          <div className="pt-1">
            <p className="text-gray-600 text-sm sm:text-base px-2">
              {isFirstQuestionInFirstBlock
                ? "این اولین تصویر است. تصویر بعدی را با این مقایسه کنید."
                : "پاسخ شما ثبت شد. تصویر بعدی به زودی نمایش داده می‌شود."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}