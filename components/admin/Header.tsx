// components/Admin/Header.tsx
import React from 'react';

export default function Header(){

  return (
    <div className="fixed top-0 right-0 left-0 bg-white  z-10 p-2 md:px-4 flex justify-between items-center rounded-b-lg">
      <div >
              <img src="/N-BACK.png" alt="N-BACK" className="w-32 h-auto" />
            </div>
  <div className="flex items-center rounded-full border border-gray-300 p-2 space-x-2 space-x-reverse pl-14">
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-00 bg-gray-100">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.125h15.002M4.501 20.125a.75.75 0 01-.75-.75V19c0-.387.19-.752.512-1.03M19.999 20.125a.75.75 0 01.75-.75V19c0-.387-.19-.752-.512-1.03m-15.002-2.125h.008v.008h-.008v-.008zm15.002-2.125h.008v.008h-.008v-.008zM4.5 17.25h15" />
      </svg>
    </div>
        <div>
          <p className="text-lg font-bold">علی اکبری</p>
          <p className="text-sm">ادمین</p>
        </div>
      </div>
  
  
    </div>
  );
}



