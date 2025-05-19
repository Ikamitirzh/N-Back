"use client";
import { School } from '@/types/school';

interface Props {
  schools: School[];
  onEdit: (school: School) => void;
  onDelete: (id: string) => void;
}

export default function SchoolTable({ schools, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-right">نام مدرسه</th>
            <th className="p-3 text-right">مقطع</th>
            <th className="p-3 text-right">شهر</th>
            <th className="p-3 text-right">تلفن</th>
            <th className="p-3 text-right">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school.id} className="border-b">
              <td className="p-3">{school.name}</td>
              <td className="p-3">{school.level}</td>
              <td className="p-3">{school.city}</td>
              <td className="p-3">{school.phone}</td>
              <td className="p-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(school)}
                    className="text-blue-600"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => onDelete(school.id)}
                    className="text-red-600"
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}