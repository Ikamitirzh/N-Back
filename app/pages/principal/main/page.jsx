"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { FaChartBar } from "react-icons/fa";
import Sidebar from "../../../../components/admin/Sidebar";
import Header from "../../../../components/admin/Header";
import Pagination from "../../../../components/ui/Pagination";
import { useAuth } from "../../../../hooks/useAuth";
import { useSearchParams } from 'next/navigation';



const BASE_URL = "https://localhost:7086";

export default function TestResultsPage() {
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId');
  const { authApiClient } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    'Pagination.PageIndex': 1,
    'Pagination.PageSize': 5,
    SearchTerm: "",
    IsRightHanded: null, // null برای همه، true برای راست‌دست، false برای چپ‌دست
    TestType: 0, // null برای همه
  });

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(filters['Pagination.PageIndex']);

  const fetchStudentsData = async () => {
    try {
      const response = await authApiClient.get(`${BASE_URL}/api/v1/school-principal/UserTestSessions/${schoolId}`, {
        params: {
          'Pagination.PageIndex': filters['Pagination.PageIndex'],
          'Pagination.PageSize': filters['Pagination.PageSize'],
          SearchTerm: filters.SearchTerm,
          IsRightHanded: filters.IsRightHanded,
          TestType: filters.TestType,
        },
      });
      setStudents(response.data.items);
      setTotalPages(Math.ceil(response.data.totalCount / filters['Pagination.PageSize']));
      setCurrentPage(response.data.pageIndex);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handlePageChange = (page) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      'Pagination.PageIndex': page,
    }));
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchStudentsData();
  }, [filters]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-right" dir="rtl">
      <Header title="admin" />
      <Sidebar />
      <div className="flex-1 p-8 mr-64 mt-21">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-[var(--Primary-base)] flex items-center">
            <FaChartBar className="ml-2" /> نتایج آزمون دانش‌آموزان
          </h2>
        </div>
        <div className="bg-white min-h-[500px] rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            {/* باکس جستجو */}
            <div className="flex-2 min-w-[350px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجو در نام و نام خانوادگی..."
                  value={filters.SearchTerm}
                  onChange={(e) => setFilters({ ...filters, SearchTerm: e.target.value })}
                  className="w-full bg-[var(--Bg-main)] p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            {/* انتخاب راست‌دست/چپ‌دست */}
            <div className="flex-1 min-w-[150px]">
              <select
                value={filters.IsRightHanded === null ? "" : filters.IsRightHanded ? "true" : "false"}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters({
                    ...filters,
                    IsRightHanded: value === "" ? null : value === "true",
                  });
                }}
                className="w-full py-2 bg-[var(--Bg-main)] px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">همه</option>
                <option value="true">راست‌دست</option>
                <option value="false">چپ‌دست</option>
              </select>
            </div>
            {/* انتخاب نوع آزمون */}
            <div className="flex-1 min-w-[150px]">
              <select
                value={filters.TestType === null ? "0" : filters.TestType}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters({
                    ...filters,
                    TestType: value === "0" ? null : parseInt(value),
                  });
                }}
                className="w-full py-2 bg-[var(--Bg-main)] px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                
                <option value="0">1-back</option>
                <option value="1">2-back</option>
                <option value="2">3-back</option>
              </select>
            </div>
          </div>

          {/* جدول دانش‌آموزان */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام و نام خانوادگی</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شماره موبایل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سن</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">راست‌دست/چپ‌دست</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع آزمون</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={student.userTestSessionId} className={index % 2 === 0 ? 'bg-white' : 'bg-[var(--Bg-main)]'}>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${student.firstName} ${student.lastName}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.isRightHanded ? "راست‌دست" : "چپ‌دست"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.testType === 0 ? "1-back" : student.testType === 1 ? "2-back" : student.testType === 2 ? "3-back" : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                    <button
                      onClick={() => router.push(`/pages/principal/principal-test-result-details?userTestSessionId=${student.userTestSessionId}&schoolId=${schoolId}`)}
                      title="مشاهده جزئیات"
                      className="p-2 bg-[var(--Primary-100)] text-blue-400 rounded-md hover:bg-blue-600 hover:text-white transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}