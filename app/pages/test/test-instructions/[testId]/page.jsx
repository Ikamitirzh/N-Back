'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import axios from 'axios';
import { FaVolumeUp, FaPlay } from 'react-icons/fa';
import Image from 'next/image';

const BASE_URL = 'https://localhost:7086';

export default function TestInstructions() {
  const router = useRouter();
  const params = useParams(); // برای استخراج path parameters
  const searchParams = useSearchParams(); // برای استخراج query parameters

  // استخراج testId از path parameter
  const testId = params.testId; // testId در path است

  // استخراج type از query parameter
  const testType = searchParams.get('type'); // type در query است

  console.log(`testId: ${testId}, testType: ${testType}`);

  const [instructions, setInstructions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // دریافت اطلاعات راهنمای آزمون
  useEffect(() => {
    if (!testId) {
      setError('آزمون معتبر نیست');
      setLoading(false);
      return;
    }

    const fetchInstructions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/WorkingMemoryTests/${testId}`);
        setInstructions(response.data);
      } catch (err) {
        setError('خطا در دریافت اطلاعات آزمون');
        console.error('Error fetching instructions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, [testId]);

  // تابع شروع پخش صوت
  const playAudio = () => {
    if (instructions?.audioPath) {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  // تابع شروع آزمون
  const startTest = () => {
    router.push(`/pages/test/test-screen?id=${testId}&type=${testType}`);
  };

  // تابع تبدیل type به نام آزمون
  const getTestName = () => {
    switch (parseInt(testType)) {
      case 0: return '1-back';
      case 1: return '2-back';
      case 2: return '3-back';
      default: return 'آزمون';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
  <Image
    src="/background.png"
    alt="Background"
    fill // معادل layout="fill" در نسخه‌های قدیمی
    className="object-cover" // معادل objectFit="cover"
    quality={100}
    priority // برای تصاویر مهم که باید سریع لود شوند
  />
</div>

     

      {/* Content Container */}
      <div className="relative z-10 bg-white bg-opacity-90 rounded-lg shadow-xl p-8 max-w-md w-full mx-4 my-8 rtl">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">قوانین {getTestName()}</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center mb-4">{error}</div>
        ) : (
          <>
            {/* متن راهنما با اسکرول داخلی */}
            <div className="max-h-64 overflow-y-auto mb-6 custom-scrollbar">
              {instructions?.description ? (
                <div className="prose prose-sm text-justify px-2">
                  {instructions.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center">راهنمای آزمون موجود نیست</div>
              )}
            </div>

            {/* بخش پخش صوت */}
            <div className="flex justify-center mb-6">
              <button
                onClick={playAudio}
                disabled={!instructions?.audioPath}
                className={`flex items-center px-4 py-2 rounded-md ${
                  instructions?.audioPath 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isPlaying ? (
                  <>
                    <span className="ml-2">در حال پخش...</span>
                  </>
                ) : (
                  <>
                    <FaVolumeUp className="ml-2" />
                    <span>پخش راهنمای صوتی</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* دکمه شروع آزمون */}
        <div className="pt-4 border-t border-gray-200 text-center">
          <button
            onClick={startTest}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium flex items-center mx-auto"
          >
            <FaPlay className="ml-2" />
            شروع آزمون
          </button>
        </div>
      </div>

      {/* استایل برای اسکرول بار سفارشی */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}