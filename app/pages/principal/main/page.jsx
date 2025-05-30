// src/app/principal/dashboard/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from "../../../../components/admin/Sidebar";
import Header from "../../../../components/admin/Header";
import ChartComponent from '../../../../components/principal/ChartComponent';
import { useAuth } from '../../../../hooks/useAuth';

const BASE_URL = 'https://localhost:7086'; // جایگزین کنید

export default function AdminDashboardPage() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId');
  const [testId, setTestId] = useState('1'); // مقدار پیشفرض 1-back
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
const { authApiClient } = useAuth();

  console.log(reportData)

  useEffect(() => {
    const fetchReport = async () => {
      if (schoolId && testId) {
        setLoading(true);
        setError('');
        try {
          const response = await authApiClient.get(`${BASE_URL}/api/v1/school-principal/WorkingMemoryResponses`, {
            params: { SchoolId: schoolId , TestId:  testId},
          });
          // if (!response.ok) {
          //   throw new Error(`HTTP error! status: ${response.status}`);
          // }

          
          setReportData(response);
        } catch (err) {
          setError('خطا در دریافت گزارش');
          console.error('Error fetching report:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReport();
  }, [schoolId, testId]);

  const handleTestIdChange = (event) => {
    setTestId(event.target.value);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-right" dir="rtl">
      <Header title="داشبورد مدیر" />
      <Sidebar />
      <div className="flex-1 p-8 mr-64 mt-21">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--Primary-base)]">تحلیل آزمون حافظه فعال</h2>
          <div>
            <select
              value={testId}
              onChange={handleTestIdChange}
              className="w-full py-2 bg-[var(--Bg-main)] px-2 border border-gray-300 rounded-lg  focus:border-blue-500"
            >
              <option value="1">1-back</option>
              <option value="2">2-back</option>
              <option value="3">3-back</option>
            </select>
          </div>
        </div>

        {loading && <div>در حال بارگذاری گزارش...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && reportData.length > 0 && (
          <ChartComponent reportData={reportData} />
        )}
        {!loading && !error && reportData.length === 0 && (
          <div>هیچ داده‌ای برای نمایش وجود ندارد.</div>
        )}
      </div>
    </div>
  );
}