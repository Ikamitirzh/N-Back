'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import axios from 'axios';
import { FaVolumeUp, FaPlay } from 'react-icons/fa';
import Image from 'next/image';
import { useAuth } from '../../../../../hooks/useAuth';
const BASE_URL = 'https://localhost:7086';

export default function TestInstructions() {
   const { authApiClient} = useAuth();

  const router = useRouter();
  const params = useParams(); 
  const searchParams = useSearchParams(); 

 
  const testId = params.testId; 

  
  const testType = searchParams.get('type'); 

  console.log(`testId: ${testId}, testType: ${testType}`);

  const [instructions, setInstructions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  
  useEffect(() => {
    if (!testId) {
      setError('آزمون معتبر نیست');
      setLoading(false);
      return;
    }

   

    const fetchInstructions = async () => {
      try {
        const response = await authApiClient.get(`${BASE_URL}/api/v1/WorkingMemoryTests/${testId}`);
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

   useEffect(() => {
  if (instructions?.audioPath) {
    
    const cleanedPath = instructions.audioPath.replace(/\\/g, '/');
    const audioUrl = `${BASE_URL}/${cleanedPath}`;
    const audioFile = new Audio(audioUrl);

    audioFile.addEventListener("ended", () => setIsPlaying(false));
    setAudio(audioFile);

    return () => {
      audioFile.pause();
      audioFile.addEventListener("ended", () => setIsPlaying(false));

    };
  }
}, [instructions?.audioPath]);



const playAudio = () => {
  if (!audio) return;

  if (isPlaying) {
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  } else {
    audio.play();
    setIsPlaying(true);
  }
};

  
  const startTest = () => {
    router.push(`/pages/test/test-screen?id=${testId}&type=${testType}`);
  };

  
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
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>

     
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600  z-10"> {getTestName()} قوانین</h1>

      {/* Content Container */}
      <div className="relative z-10 bg-white bg-opacity-90 rounded-lg shadow-xl p-8 max-w-150 w-full mx-4 my-7 rtl">
       
        <div className="flex justify-start mb-6">
          <button
            onClick={playAudio}
            disabled={!instructions?.audioPath}
            className={`flex items-center px-3 py-3 rounded-full bg-orange-400 ${
              instructions?.audioPath 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-100 cursor-not-allowed'
            }`}
          >
            {isPlaying ? (
  <>
    <span className="ml-2">در حال پخش...</span>
    <FaPlay className="" />
  </>
) : (
  <>
    <FaVolumeUp className="" />
    
  </>
)}

          </button>
        </div>

        
        <div className="max-h-64 overflow-y-auto mb-6 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center mb-4">{error}</div>
          ) : (
            <div className="prose prose-sm text-right px-2">
              {instructions?.description ? (
                <div dir="rtl">
                  {instructions.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center">راهنمای آزمون موجود نیست</div>
              )}
            </div>
          )}
        </div>

        
        <div className="pt-4 border-t border-gray-200 text-center">
          <button
            onClick={startTest}
            className="px-55 py-2  bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium flex items-center mx-auto"
          >
           
            شروع آزمون
          </button>
        </div>
      </div>

      
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