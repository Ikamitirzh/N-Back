// components/ui/button.tsx
import React from "react";

export const Button = ({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};