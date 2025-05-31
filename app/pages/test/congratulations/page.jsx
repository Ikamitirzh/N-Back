'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { useSearchParams } from 'next/navigation';
export default function CongratulationsPage() {
    const searchParams = useSearchParams();
  const router = useRouter();
const testId = searchParams.get('id');
  const testType = searchParams.get('type');

  useEffect(() => {
    // شروع افکت کنفتی
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
    });
    const numericTestId = Number(testId);
    // بعد از ۳ ثانیه رفتن به صفحه نتایج
    const timer = setTimeout(() => {
      router.push(`/pages/test/test-results?id=${numericTestId}&type=${testType}`); // پارامترها را بده
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-center px-4">
      <h1 className="text-4xl font-extrabold mb-4">تبریک!</h1>
      <p className="text-lg">شما با موفقیت آزمون نهایی را به پایان رساندید 👏</p>
    </div>
  );
}
