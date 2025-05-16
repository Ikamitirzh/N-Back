// components/SchoolList.js
import React from "react";
import { FaPen, FaEye } from "react-icons/fa";

export default function SchoolList({ schools, onEdit, onDelete, onDetails }) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام مدرسه</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مقطع</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شهرستان</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد پستی</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تلفن</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {schools.map((school, index) => (
          <tr key={school.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{school.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.level}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.city}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.postalCode}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.phone}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
              <button onClick={() => onEdit(school)} title="ویرایش">
                <FaPen />
              </button>
              <button onClick={() => onDetails(school.id)} title="مشاهده">
                <FaEye />
              </button>
              <button onClick={() => onDelete(school.id)} title="حذف">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.414-9L4 14.059A1.002 1.002 0 004.059 15h7.882c.071 0 .142 0 .21.003A1.002 1.002 0 0012 15.059V9z" />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}