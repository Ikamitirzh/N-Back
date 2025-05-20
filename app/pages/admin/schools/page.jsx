"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, LogOut, LogIn } from "lucide-react";
import { FaChartBar, FaPlus, FaSchool } from "react-icons/fa";
import { fetchSchools, addSchool, updateSchool, deleteSchool, getSchoolDetails, getProvinceIdByName, getCityIdByName } from "../../../../utils/api";
import SchoolModal from "../../../../components/admin/schools/SchoolModal";
import SchoolDetailsModal from "../../../../components/admin/schools/SchoolDetailsModal";
import Sidebar from "../../../../components/admin/Sidebar";
import Header from "../../../../components/admin/Header";
import { useAuth } from "../../../../hooks/useAuth";
import Pagination from "../../../../components/ui/Pagination";
import ComboBox from "../../../../components/ComboBox";

export default function SchoolManagementPage() {
  const router = useRouter();
  const [schools, setSchools] = useState([]);
  const [filters, setFilters] = useState({
    'Pagination.PageIndex': 1,
    'Pagination.PageSize': 7,
    Level: 0,
    cityId: null,
    cityName: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [newSchool, setNewSchool] = useState({
    name: "",
    address: "",
    postalCode: "",
    telNumber: "",
    level: 0, // مقدار اولیه رو به 0 تغییر دادیم
    provinceId: 0,
    cityId: 0,
  });
  console.log(selectedSchool)
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(filters['Pagination.PageIndex']);
  // const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);

  console.log(` اپشن ${options}`)


  
  const fetchSchoolsData = async () => {
    try {
      const response = await fetchSchools({ ...filters, SearchTerm: searchQuery });
      setSchools(response.items);
      setTotalPages(Math.ceil(response.totalCount / filters['Pagination.PageSize']));
      setCurrentPage(response.pageIndex);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const handleAddSchool = async () => {
    try {
      const schoolToSend = {
        name: newSchool.name,
        address: newSchool.address,
        postalCode: newSchool.postalCode,
        telNumber: newSchool.telNumber,
        level: parseInt(newSchool.level) || 0, // مطمئن می‌شیم که یه عدد معتبر باشه
        provinceId: parseInt(newSchool.provinceId) || null,
        cityId: parseInt(newSchool.cityId) || null,
      };
      await addSchool(schoolToSend);
      setIsAddModalOpen(false);
      fetchSchoolsData();
    } catch (error) {
      console.error("Error adding school:", error);
      alert("خطا در افزودن مدرسه");
    }
  };

  const handleUpdateSchool = async () => {
    try {
      const provinceId = await getProvinceIdByName(selectedSchool.provinceName);
      const cityId = await getCityIdByName(selectedSchool.cityName);
      const updatedSchool = {
        ...selectedSchool,
        
        level: parseInt(selectedSchool.level) || 0, // مطمئن می‌شیم که level یه عدد باشه
        provinceId: parseInt(provinceId) || null,
        cityId: parseInt(cityId) || null,
      };
      await updateSchool(selectedSchool.id, updatedSchool);
      setIsEditModalOpen(false);
      fetchSchoolsData();
    } catch (error) {
      console.error("Error updating school:", error);
    }
  };

  const handleDeleteSchool = async (schoolId) => {
    try {
      await deleteSchool(schoolId);
      fetchSchoolsData();
    } catch (error) {
      console.error("Error deleting school:", error);
    }
  };

  const openEditModal = (school) => {
    setSelectedSchool({
      ...school,
      level: parseInt(school.level) || 0, // مطمئن می‌شیم که level یه عدد باشه
    });
    setIsEditModalOpen(true);
  };

  const openDetailsModal = async (schoolId) => {
    try {
      const schoolDetails = await getSchoolDetails(schoolId);
      setSelectedSchool({
        ...schoolDetails,
        level: parseInt(schoolDetails.level) || 0, // مطمئن می‌شیم که level یه عدد باشه
      });
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("Error getting school details:", error);
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
    fetchSchoolsData();
  }, [filters, searchQuery]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-right" dir="rtl">
      <Header title="admin" />
      <Sidebar />
      <div className="flex-1 p-8 mr-64 mt-21">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-[var(--Primary-base)] flex items-center">
            <FaSchool className="ml-2" /> مدیریت مدارس
          </h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-[var(--Primary-base)] text-white py-2 px-6 rounded-lg flex items-center"
          >
            <FaPlus className="ml-2" /> افزودن مدرسه
          </button>
        </div>
        <div className="bg-white min-h-[500px] rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-2 min-w-[350px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            <div className="flex-1 min-w-[100px]">
              <select
                value={filters.Level}
                onChange={(e) => setFilters({ ...filters, Level: parseInt(e.target.value) })}
                className="w-full bg-gray-100 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="0">ابتدایی</option>
                <option value="1">متوسطه اول</option>
                <option value="2">متوسطه دوم</option>
              </select>
            </div>
            <div className="flex-1 min-w-[100px]">
              <div className="flex-1 min-w-[100px] flex items-center gap-2">
                <ComboBox
                  label="شهر"
                  apiEndpoint="Cities"
                  selectedValue={filters.cityName}
                  onChange={(city) => {
                    setFilters({
                      ...filters,
                      cityId: city.id,
                      cityName: city.name,
                    });
                  }}
                  className="bg-gray-100 flex-1"
                />
                {filters.cityId && (
                  <button
                    onClick={() => setFilters({ ...filters, cityId: null, cityName: "" })}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام مدرسه</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مقطع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">استان</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شهرستان</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد پستی</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تلفن</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">آدرس</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schools.map((school, index) => (
                <tr key={school.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{school.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {school.level === 0 ? "ابتدایی" : school.level === 1 ? "متوسطه اول" : "متوسطه دوم"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.provinceName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.cityName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.postalCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.telNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                    <button
                      onClick={() => openDetailsModal(school.id)}
                      title="مشاهده"
                      className="p-2 bg-blue-200 text-blue-400 rounded-full hover:bg-blue-600 hover:text-white transition"
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
                    <button
                      onClick={() => openEditModal(school)}
                      title="ویرایش"
                      className="p-2 bg-yellow-100 text-yellow-500 rounded-full hover:bg-yellow-500 hover:text-white transition"
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
                          d="M16.862 3.487a2.121 2.121 0 113 3L7.5 18.85l-4.243.707.707-4.243L16.862 3.487z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteSchool(school.id)}
                      title="حذف"
                      className="p-2 bg-red-200 text-red-400 rounded-full hover:bg-red-400 hover:text-white transition"
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
                          d="M6 18L18 6M6 6l12 12"
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
        {isAddModalOpen && (
          <SchoolModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleAddSchool}
            school={newSchool}
            onChange={(field, value) =>
              setNewSchool({ ...newSchool, [field]: value })
            }
          />
        )}
        {isEditModalOpen && (
          <SchoolModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUpdateSchool}
            school={selectedSchool}
            onChange={(field, value) =>
              setSelectedSchool({ ...selectedSchool, [field]: value })
            }
          />
        )}
        {isDetailsModalOpen && (
          <SchoolDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            school={selectedSchool}
          />
        )}
      </div>
    </div>
  );
}