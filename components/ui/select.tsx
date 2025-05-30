// components/ui/select.tsx
import React from "react";

export const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      className="border border-gray-300 rounded-xl px-3 py-2 w-full text-right bg-white focus:ring-2 focus:ring-blue-500"
      {...props}
    >
      {children}
    </select>
  );
};

export const SelectTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectValue = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
);