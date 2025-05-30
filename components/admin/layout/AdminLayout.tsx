"use client";
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-50">
     
      <div className="w-64 bg-blue-800 text-white p-4">
        <h2 className="text-xl font-bold mb-8">پنل مدیریت</h2>
        <nav className="space-y-2">
          <button 
            className="block w-full text-right p-2 hover:bg-blue-700 rounded"
            onClick={() => router.push('/admin/schools')}
          >
            مدارس
          </button>
          
        </nav>
      </div>

      
      <div className="flex-1">
        
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div>خوش آمدید، مدیر</div>
          <button 
            className="text-red-500"
            onClick={() => router.push('/')}
          >
            خروج
          </button>
        </header>

        
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}