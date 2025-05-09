// components/ui/card.tsx
import React from "react";

export const Card = ({ className = "", children }: { className?: string; children: React.ReactNode }) => {
  return <div className={`bg-white rounded-2xl shadow p-6 ${className}`}>{children}</div>;
};

export const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};
