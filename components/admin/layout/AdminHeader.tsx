"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  return (
    <header className="fixed top-0 right-0 left-0 bg-white shadow-md z-10 p-3 md:p-4 flex justify-between items-center rounded-b-lg">
      <div>
        <Image 
          src="/N-BACK.png" 
          alt="N-BACK Logo" 
          width={128}
          height={40}
          className="w-32 h-auto"
        />
      </div>
      
      <div className="flex items-center rounded-full border border-gray-300 p-2 space-x-2 space-x-reverse pl-14">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 bg-gray-100">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-5 h-5 md:w-6 md:h-6"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.125h15.002M4.501 20.125a.75.75 0 01-.75-.75V19c0-.387.19-.752.512-1.03M19.999 20.125a.75.75 0 01.75-.75V19c0-.387-.19-.752-.512-1.03m-15.002-2.125h.008v.008h-.008v-.008zm15.002-2.125h.008v.008h-.008v-.008zM4.5 17.25h15" 
            />
          </svg>
        </div>
        <div className="text-right pr-3">
          <span className="block text-gray-700 font-semibold text-sm md:text-base">ایکامی تیرژ</span>
          <span className="block text-blue-600 text-xs md:text-sm">ادمین</span>
        </div>
      </div>
    </header>
  );
}