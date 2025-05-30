// components/ui/dialog.tsx
import React from "react";

export const Dialog = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">{children}</div>
    </div>
  );
};

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 border-b pb-2">{children}</div>
);

export const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-bold text-gray-800">{children}</h2>
);

export const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-6 flex justify-end gap-2">{children}</div>
);
