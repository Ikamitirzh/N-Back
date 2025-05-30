// components/Sidebar.tsx
import { LogOut, School } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { FaChartBar, FaSchool } from 'react-icons/fa';
import { useAuth } from "../../hooks/useAuth"; 

export default function Sidebar() {
  const router = useRouter();
   const { adminLogout } = useAuth(); 


  const handleLogout = async () => {
    try {
      await adminLogout()
      router.push('/login');
    } catch (err) {
      console.error('Error cancelling test:', err);
    }
  };


  return (
   <div className="w-64 bg-gradient-to-t from-[var(--sidebar-buttom)] to-[var(--sidebar-top)] text-white rounded-tl-3xl py-6 fixed h-[calc(100vh-80px)] top-24">
  
      <div className="h-full flex flex-col">
        <div className="my-10">
          <div className="space-y-4 ml-5">
            <button className="w-full py-3 px-4 ml-5 bg-blue-500 text-white font-medium rounded-l-lg text-right hover:bg-blue-800 transition hover:border-r-2 hover:border-white flex items-center justify-start">
              <FaSchool className="ml-2" /> مدیریت مدارس
            </button>
            <button className="w-full py-3 px-4 text-blue-100 hover:bg-blue-500 rounded-l-lg text-right hover:text-white transition hover:border-r-2 hover:border-white flex items-center justify-start">
              <FaChartBar className="ml-2" /> گزارش آزمون
            </button>
          </div>
        </div>

        <div className="mt-auto mb-4 ml-5">
          <button
            onClick={handleLogout} 
            className="w-full py-3 px-4 text-blue-100 hover:bg-blue-500 rounded-l-lg text-right hover:text-white transition hover:border-r-2 hover:border-white flex items-center justify-start"
          >
            <LogOut size={18} className="text-red-500 ml-1" />
            <span className="text-red-500"> خروج از سامانه</span>
          </button>
        </div>
      </div>
    </div>
  );
}