// components/Sidebar.tsx
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter, usePathname } from 'next/navigation'; // usePathname رو اضافه می‌کنیم
import { FaChartBar, FaSchool} from 'react-icons/fa';
import { useAuth } from "../../hooks/useAuth"; 
import {  TrendingUp } from "lucide-react";
export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // مسیر فعلی رو می‌گیره
  const { adminLogout } = useAuth(); 

  const handleLogout = async () => {
    try {
      await adminLogout();
      router.push('/login');
    } catch (err) {
      console.error('Error cancelling test:', err);
    }
  };

  // لیست آیتم‌های سایدبار با مسیرها
  const navItems = [
    { label: "مدیریت مدارس", path: "/pages/admin/schools", icon: <FaSchool className="ml-2" /> },
    { label: "گزارش آزمون", path: "/pages/admin/result-exam", icon: <FaChartBar className="ml-2" /> },
    { label: "تحلیل آزمون", path: "/pages/admin/exam-analysis", icon: <TrendingUp className="ml-2" /> },
  ];

  return (
    <div className="w-64 bg-gradient-to-t from-[var(--sidebar-buttom)] to-[var(--sidebar-top)] text-white rounded-tl-3xl py-6 fixed h-[calc(100vh-80px)] top-24">
      <div className="h-full flex flex-col">
        <div className="my-10">
          <div className="space-y-4 ml-5">
            {navItems.map((item) => {
              const isActive = pathname === item.path; // چک می‌کنیم که آیا این مسیر فعاله
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={clsx(
                    "w-full py-3 px-4 text-blue-100 rounded-l-lg text-right transition hover:border-r-2 hover:border-white flex items-center justify-start",
                    {
                      "bg-blue-500 text-white font-medium": isActive, // رنگ روشن‌تر برای دکمه فعال
                      "hover:bg-blue-500 hover:text-white": !isActive, // هاور فقط برای دکمه‌های غیرفعال
                    }
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
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