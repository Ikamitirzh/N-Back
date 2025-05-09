// components/Sidebar.tsx
import { useRouter } from 'next/router';
import { LogOut, School } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function Sidebar() {
  const router = useRouter();
  const activeRoute = router.pathname;

  const menuItems = [
    { name: 'مدیریت مدارس', href: '/dashboard/schools', icon: <School size={20} /> },
    { name: 'گزارش آزمون', href: '/dashboard/reports', icon: <School size={20} /> }, // جایگزین با آیکون مناسب بعدا
  ];

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="bg-gradient-to-b from-[#0a3b7e] to-[#0a3b7e]/90 text-white w-64 py-6 px-4 flex flex-col justify-between rounded-l-3xl">
      <div>
        <div className="text-right px-2 mb-8">
          <h1 className="text-2xl font-bold">N - BACK</h1>
        </div>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <div className={clsx(
                'flex items-center justify-between bg-white/10 hover:bg-white/20 text-sm p-3 rounded-xl cursor-pointer',
                activeRoute === item.href && 'bg-white text-[#0a3b7e] font-bold'
              )}>
                <span>{item.name}</span>
                {item.icon}
              </div>
            </Link>
          ))}
        </nav>
      </div>
      <div className="text-red-400 text-sm flex items-center justify-between px-3 cursor-pointer" onClick={handleLogout}>
        خروج از سامانه
        <LogOut size={18} />
      </div>
    </div>
  );
}
