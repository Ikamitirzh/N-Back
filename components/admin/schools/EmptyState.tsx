interface EmptyStateProps {
  onAddNew?: () => void; 
}

export default function EmptyState({ onAddNew }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="mb-4">
        <img 
          src="/empty-state.png" 
          alt="بدون داده" 
          className="w-32 h-auto opacity-70"
        />
      </div>
      <div className="text-center text-gray-500">
        <p className="text-lg">مدرسه‌ای یافت نشد</p>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            افزودن مدرسه جدید
          </button>
        )}
      </div>
    </div>
  );
}