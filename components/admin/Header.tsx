// components/Admin/Header.tsx
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      {/* User Info */}
      <div className="flex items-center space-x-2">
        <div className="bg-gray-300 rounded-full p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A13.935 13.935 0 0112 15m7.879 2.804a13.935 13.935 0 01-1.911-5.473 8.374 8.374 0 001.911 5.473zm0 0H4.221c-.383 0-.679-.223-.679-.586V10a.5.5 0 011 0v7.214c0 .363.296.586.679.586z"
            />
          </svg>
        </div>
        <div>
          <p className="text-lg font-bold">آرزو غلامی</p>
          <p className="text-sm">ادمین</p>
        </div>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
};

export default Header;