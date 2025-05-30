"use client";
import { FaSchool, FaChartBar } from "react-icons/fa";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminSidebarProps {
  activeItem?: "schools" | "reports";
}

export default function AdminSidebar({ activeItem = "schools" }: AdminSidebarProps) {
  const router = useRouter();

  return (
    <div className="w-64 bg-gradient-to-t from-blue-950 to-blue-700 text-white rounded-tl-3xl py-6 fixed h-[calc(100vh-80px)] top-24">
      <div className="h-full flex flex-col">
        <div className="my-10">
          <div className="space-y-4 ml-5">
            <button
              className={`w-full py-3 px-4 ml-5 rounded-l-lg text-right transition hover:border-r-2 hover:border-white flex items-center justify-start ${
                activeItem === "schools"
                  ? "bg-blue-500 text-white font-medium"
                  : "text-blue-100 hover:bg-blue-500 hover:text-white"
              }`}
              onClick={() => router.push("/admin/schools")}
            >
              <FaSchool className="ml-2" />
              مدیریت مدارس
            </button>
            
            <button
              className={`w-full py-3 px-4 ml-5 rounded-l-lg text-right transition hover:border-r-2 hover:border-white flex items-center justify-start ${
                activeItem === "reports"
                  ? "bg-blue-500 text-white font-medium"
                  : "text-blue-100 hover:bg-blue-500 hover:text-white"
              }`}
              onClick={() => router.push("/admin/reports")}
            >
              <FaChartBar className="ml-2" />
              گزارش آزمون
            </button>
          </div>
        </div>
        
        <div className="mt-auto mb-4">
          <button
            onClick={() => router.push("/")}
            className="w-full py-2 px-4 flex items-center justify-center space-x-2 space-x-reverse text-blue-100 hover:bg-blue-700 rounded-lg transition"
          >
            <LogOut size={18} className="text-red-500 ml-1" />
            <span className="text-red-500">خروج</span>
          </button>
        </div>
      </div>
    </div>
  );
}