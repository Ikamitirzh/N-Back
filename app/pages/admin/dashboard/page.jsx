"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Search, X, LogOut } from "lucide-react";
import { FaChartBar, FaPlus, FaSchool } from "react-icons/fa";
import Image from "next/image";

export default function SchoolManagementPage() {
  const router = useRouter();
  const [schools, setSchools] = useState([]);
  const [filters, setFilters] = useState({ level: "", city: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: "",
    level: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const fetchSchools = async () => {
    try {
      const { data } = await axios.get("/api/schools", { 
        params: { ...filters, search: searchQuery } 
      });
      setSchools(data);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const addSchool = async () => {
    try {
      await axios.post("/api/schools", newSchool);
      setIsModalOpen(false);
      setNewSchool({
        name: "",
        level: "",
        city: "",
        postalCode: "",
        phone: "",
      });
      fetchSchools();
    } catch (error) {
      console.error("Error adding school:", error);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [filters, searchQuery]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-right" dir="rtl">
      {/* Header */}
      <div className="fixed top-0 right-0 left-0 bg-white shadow-md z-10 p-3 md:p-4 flex justify-between items-center rounded-b-lg">
      <div >
              <img src="/N-BACK.png" alt="N-BACK" className="w-32 h-auto" />
            </div>
  <div className="flex items-center rounded-full border border-gray-300 p-2 space-x-2 space-x-reverse pl-14">
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-00 bg-gray-100">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.125h15.002M4.501 20.125a.75.75 0 01-.75-.75V19c0-.387.19-.752.512-1.03M19.999 20.125a.75.75 0 01.75-.75V19c0-.387-.19-.752-.512-1.03m-15.002-2.125h.008v.008h-.008v-.008zm15.002-2.125h.008v.008h-.008v-.008zM4.5 17.25h15" />
      </svg>
    </div>
    <div className="text-right pr-3">
      <span className="block text-gray-700 font-semibold text-sm md:text-base">ایکامی تیرژ</span>
      <span className="block text-blue-600 text-xs md:text-sm">ادمین</span>
    </div>
  </div>
</div>

      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-t from-blue-950 to-blue-700 text-white rounded-tl-3xl py-6 fixed h-[calc(100vh-80px)] top-24">
  <div className="h-full flex flex-col">
  <div className="my-10 ">
  <div className="space-y-4 ml-5">
    <button className="w-full py-3 px-4 ml-5 bg-blue-500 text-white font-medium rounded-l-lg text-right hover:bg-blue-800 transition hover:border-r-2 hover:border-white flex items-center justify-start">
    <FaSchool className="ml-2" /> مدیریت مدارس
    </button>
    <button className="w-full py-3 px-4 text-blue-100 hover:bg-blue-500 rounded-l-lg text-right hover:text-white transition hover:border-r-2 hover:border-white flex items-center justify-start">
    <FaChartBar className="ml-2" /> گزارش آزمون
    </button>
  </div>
</div>
    
    <div className="mt-auto mb-4">
      <button 
        onClick={() => router.push("/")}
        className="w-full py-2 px-4 flex items-center justify-center space-x-2 space-x-reverse text-blue-100 hover:bg-blue-700 rounded-lg transition"
      >
        <LogOut size={18} className="text-red-500 ml-1"/>
        <span className="text-red-500">خروج</span>
      </button>
    </div>
  </div>
</div>

      {/* Main Content */}
      <div className="flex-1 p-8 mr-64 mt-21">
     
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-xl font-bold text-[var(--Primary-base)] flex items-center">
      <FaSchool className="ml-2" /> مدیریت مدارس
    </h2>
    <button
      onClick={() => setIsModalOpen(true)}
      className="bg-blue-600 hover:bg-[var(--Primary-base)] text-white py-2 px-6 rounded-lg flex items-center"
    >
      <FaPlus className="ml-2" /> افزودن مدرسه
    </button>
  </div>



        {/* Filters and Search */}
        <div className="bg-white min-h-[500px] rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 mb-4">

            <div className="flex-2 min-w-[350px] ">
              
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
                value={filters.level}
                onChange={(e) => setFilters({...filters, level: e.target.value})}
                className="w-full bg-gray-100 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">همه مقاطع</option>
                <option value="ابتدایی">ابتدایی</option>
                <option value="متوسطه اول">متوسطه اول</option>
                <option value="متوسطه دوم">متوسطه دوم</option>
              </select>
            </div>
            
            <div className="flex-1 min-w-[100px]">
              
              <select
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
                className="w-full bg-gray-100 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">همه شهرها</option>
                <option value="تهران">تهران</option>
                <option value="مشهد">مشهد</option>
                <option value="اصفهان">اصفهان</option>
              </select>
            </div>
            
          </div>
        

        {/* Schools List */}
        
          {schools.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8">
            <div className="mb-4">
              <img src="/Navigation_empty.png" alt="بدون داده" className="w-32 h-auto" />
            </div>
            <div className="text-center text-gray-500">
              <p>داده‌ای برای نمایش وجود ندارد</p>
            </div>
          </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام مدرسه</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مقطع</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شهرستان</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کدپستی</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تلفن</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schools.map((school, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{school.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.level}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.postalCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
       
        </div>

        {isModalOpen && (
  <div className="fixed inset-0 bg-gray bg-opacity-85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl"> {/* عرض مودال رو بیشتر کردم */}
      <div className="flex justify-between items-center border-b p-4">
        <h3 className="text-lg font-bold">افزودن مدرسه</h3>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          {/* آیکون بستن */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"> {/* استفاده از Grid برای چیدمان دو ستونه در سایزهای متوسط به بالا */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام مدرسه <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="نام مدرسه را وارد کنید"
            value={newSchool.name}
            onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">مقطع <span className="text-red-500">*</span></label>
          <select
            value={newSchool.level}
            onChange={(e) => setNewSchool({ ...newSchool, level: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          >
            <option value="">انتخاب کنید</option>
            <option value="ابتدایی">ابتدایی</option>
            <option value="متوسطه اول">متوسطه اول</option>
            <option value="متوسطه دوم">متوسطه دوم</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">استان <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="انتخاب کنید"
            value={newSchool.state}
            onChange={(e) => setNewSchool({ ...newSchool, state: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">شهرستان <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="انتخاب کنید"
            value={newSchool.city}
            onChange={(e) => setNewSchool({ ...newSchool, city: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">کد پستی</label>
          <input
            type="text"
            placeholder="کد پستی"
            value={newSchool.postalCode}
            onChange={(e) => setNewSchool({ ...newSchool, postalCode: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس <span className="text-red-500">*</span></label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              +۹۸
            </span>
            <input
              type="text"
              placeholder="مثال: ۰۹۱۲۳۴۵۶۷"
              value={newSchool.phone}
              onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-16 p-2"
            />
          </div>
        </div>

        <div className="col-span-full"> {/* آدرس در یک ردیف کامل */}
          <label className="block text-sm font-medium text-gray-700 mb-1">آدرس <span className="text-red-500">*</span></label>
          <textarea
            placeholder="آدرس را وارد کنید"
            value={newSchool.address}
            onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-between p-4 border-t">
        <button
          onClick={addSchool}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-100"
        >
          تایید
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 text-gray-700 ml-2 rounded-md hover:bg-gray-100 w-100"
        >
          انصراف
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}