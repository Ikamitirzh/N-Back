"use client";
import { School } from '@/types/school';
import { X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  school?: School | null;
  onSubmit: (school: School) => void;
  onClose: () => void;
}

export default function SchoolForm({ school, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<Omit<School, 'id'>>({
    name: school?.name || '',
    level: school?.level || '',
    city: school?.city || '',
    phone: school?.phone || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: school?.id || Date.now().toString(),
      ...form
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {school ? 'ویرایش مدرسه' : 'افزودن مدرسه جدید'}
          </h2>
          <button onClick={onClose} className="text-gray-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">نام مدرسه</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">مقطع</label>
              <select
                value={form.level}
                onChange={(e) => setForm({...form, level: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">انتخاب کنید</option>
                <option value="ابتدایی">ابتدایی</option>
                <option value="متوسطه اول">متوسطه اول</option>
                <option value="متوسطه دوم">متوسطه دوم</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">شهر</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({...form, city: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">تلفن</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}