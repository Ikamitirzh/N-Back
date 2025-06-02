"use client";

import { useEffect, useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, Activity, TrendingUp } from "lucide-react";

import Sidebar from "../../../../components/admin/Sidebar"; 
import Header from "../../../../components/admin/Header";   
import { useAuth } from "../../../../hooks/useAuth";    
import Pagination from "../../../../components/ui/Pagination"; 

const BASE_URL = "https://localhost:7086";

const TEST_TYPE_OPTIONS = [
  { value: "0", label: "1-back" },
  { value: "1", label: "2-back" },
  { value: "2", label: "3-back" },
];


const COLORS = {
  correct: "#0891b2",   
  unanswered: "#f59e0b", 
  incorrect: "#e11d48",  
};

const BARS_PER_PAGE = 10; 

export default function AdminTestAnalysisPage() {
  const { authApiClient } = useAuth();

  const [selectedTestType, setSelectedTestType] = useState(TEST_TYPE_OPTIONS[0].value);
  const [fullChartData, setFullChartData] = useState([]);
  const [displayedChartData, setDisplayedChartData] = useState([]);
  const [currentChartPage, setCurrentChartPage] = useState(1);
  const [numChartPages, setNumChartPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [xAxisTitle, setXAxisTitle] = useState(TEST_TYPE_OPTIONS[0].label);

  
  const processDataForChart = (apiData) => {
    if (!apiData || apiData.length === 0) return [];
    return apiData.map(item => {
      const totalResponses = (item.correctCount || 0) + (item.incorrectCount || 0) + (item.unansweredCount || 0);
      if (totalResponses === 0) {
        return {
          name: `سوال ${item.order + 1}`,
          correctPercent: 0, incorrectPercent: 0, unansweredPercent: 0,
          correctCount: 0, incorrectCount: 0, unansweredCount: 0, totalResponses,
        };
      }
      return {
        name: `سوال ${item.order + 1}`,
        correctPercent: parseFloat(((item.correctCount / totalResponses) * 100).toFixed(1)),
        incorrectPercent: parseFloat(((item.incorrectCount / totalResponses) * 100).toFixed(1)),
        unansweredPercent: parseFloat(((item.unansweredCount / totalResponses) * 100).toFixed(1)),
        correctCount: item.correctCount, incorrectCount: item.incorrectCount, unansweredCount: item.unansweredCount, totalResponses,
      };
    });
  };

  const fetchData = useCallback(async () => {
    if (!selectedTestType) return;
    setLoading(true);
    setError('');
    try {
      const response = await authApiClient.get(
        `${BASE_URL}/api/v1/admin/WorkingMemoryTerms/statistics`,
        { params: { TestType: parseInt(selectedTestType) } }
      );
      const processedData = processDataForChart(response.data);
      setFullChartData(processedData);
      setCurrentChartPage(1); 
      setNumChartPages(Math.max(1, Math.ceil(processedData.length / BARS_PER_PAGE)));
      const selectedOption = TEST_TYPE_OPTIONS.find(opt => opt.value === selectedTestType);
      setXAxisTitle(selectedOption ? selectedOption.label : '');
    } catch (err) {
      console.error("Error fetching test analysis data:", err);
      setError("خطا در دریافت داده‌های تحلیل آزمون. لطفاً دوباره تلاش کنید.");
      setFullChartData([]);
      setNumChartPages(1);
    } finally {
      setLoading(false);
    }
  }, [authApiClient, selectedTestType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (fullChartData.length > 0) {
      const startIndex = (currentChartPage - 1) * BARS_PER_PAGE;
      const endIndex = startIndex + BARS_PER_PAGE;
      setDisplayedChartData(fullChartData.slice(startIndex, endIndex));
    } else {
      setDisplayedChartData([]);
    }
  }, [fullChartData, currentChartPage]);

  const handleTestTypeChange = (event) => {
    setSelectedTestType(event.target.value);
  };

  const handleChartPageChange = (page) => {
    if (page >= 1 && page <= numChartPages) {
      setCurrentChartPage(page);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const totalOriginal = payload[0]?.payload?.totalResponses || 0;
      return (
        <div className="bg-white p-3 shadow-lg rounded-md border border-gray-200 text-xs text-gray-700">
          <p className="font-bold text-gray-800 mb-1.5">{label}</p>
          {payload.map((entry, index) => {
            let legendLabel = '';
            if (entry.dataKey === 'correctPercent') legendLabel = 'پاسخ درست';
            else if (entry.dataKey === 'unansweredPercent') legendLabel = 'بدون پاسخ';
            else if (entry.dataKey === 'incorrectPercent') legendLabel = 'پاسخ نادرست';
            const originalCount = entry.payload[`${entry.dataKey.replace('Percent', 'Count')}`] || 0;
            return (
              <p key={`item-${index}`} style={{ color: entry.color }} className="my-0.5">
                {legendLabel}: {entry.value}% ({originalCount} عدد)
              </p>
            );
          })}
           <p className="mt-1.5 pt-1 border-t border-gray-300 text-gray-600">مجموع پاسخ‌ها: {totalOriginal}</p>
        </div>
      );
    }
    return null;
  };
  
  const legendPayload = [
    { value: 'پاسخ درست', type: 'square', id: 'correct', color: COLORS.correct },
    { value: 'بدون پاسخ', type: 'square', id: 'unanswered', color: COLORS.unanswered },
    { value: 'پاسخ نادرست', type: 'square', id: 'incorrect', color: COLORS.incorrect },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 text-right" dir="rtl">
      <Header title="پنل ادمین - تحلیل آزمون" />
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 md:p-8 mr-0 md:mr-64 mt-16 md:mt-20">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
            <TrendingUp size={28} className="ml-2 text-blue-600" />
            تحلیل آزمون‌ها
          </h2>
          <div className="relative w-full sm:w-auto min-w-[200px] shadow-sm rounded-lg">
            <select
              value={selectedTestType}
              onChange={handleTestTypeChange}
              className="w-full sm:w-auto appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-10 rounded-lg leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 text-sm"
            >
              {TEST_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">
              <ChevronDown size={18} />
            </div> */}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 min-h-[500px] flex flex-col border border-gray-200/70">
          {loading ? (
            <div className="flex-grow flex flex-col justify-center items-center text-gray-500">
              <Activity size={48} className="text-blue-500 animate-pulse mb-3" />
              <p>در حال بارگذاری داده‌های نمودار...</p>
            </div>
          ) : error ? (
            <div className="flex-grow flex flex-col justify-center items-center text-center text-red-600 p-6 bg-red-50 rounded-lg border border-red-200">
                <p className="text-lg mb-3">{error}</p>
                <button 
                    onClick={fetchData} 
                    className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                >
                    تلاش مجدد
                </button>
            </div>
          ) : displayedChartData.length === 0 ? (
            <div className="flex-grow flex flex-col justify-center items-center text-center text-gray-500 p-6">
                <p className="text-lg">داده‌ای برای نمایش در نمودار با آزمون <span className="font-semibold text-blue-600">{xAxisTitle}</span> یافت نشد.</p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mb-1 sm:mb-2 text-center">
                آمار پاسخ‌ها برای آزمون: <span className="text-blue-600">{xAxisTitle}</span>
              </h3>
              <p className="text-xs text-gray-500 text-center mb-6">
                نمایش سوالات {fullChartData.length > 0 ? ((currentChartPage - 1) * BARS_PER_PAGE) + 1 : 0} تا {Math.min(currentChartPage * BARS_PER_PAGE, fullChartData.length)} از {fullChartData.length}
              </p>
              
              {/* chart container */}
              <div className="flex-grow h-[400px] sm:h-[450px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={displayedChartData}
                    margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                    barSize={Math.max(15, Math.min(35, 450 / displayedChartData.length))} //manage bar width
                    animationDuration={800} // مدت زمان انیمیشن پر شدن میله‌ها
                    animationEasing="ease-out" // نوع انیمیشن
                  >
                    {/* تعریف گرادیانت‌ها برای میله‌ها */}
                    <defs>
                      <linearGradient id="gradientCorrect" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS.correct} stopOpacity={0.85}/>
                        <stop offset="100%" stopColor={COLORS.correct} stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="gradientUnanswered" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS.unanswered} stopOpacity={0.85}/>
                        <stop offset="100%" stopColor={COLORS.unanswered} stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="gradientIncorrect" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS.incorrect} stopOpacity={0.85}/>
                        <stop offset="100%" stopColor={COLORS.incorrect} stopOpacity={1}/>
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11, fill: '#4b5563' }} 
                      axisLine={{ stroke: '#d1d5db' }}
                      tickLine={{ stroke: '#d1d5db' }}
                      interval={0}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      ticks={[0, 25, 50, 75, 100]}
                      tickFormatter={(tick) => `${tick}%`}
                      tick={{ fontSize: 11, textAnchor: 'end', fill: '#4b5563' }}
                      axisLine={{ stroke: '#d1d5db' }}
                      tickLine={{ stroke: '#d1d5db' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(209, 213, 219, 0.2)' }} />
                    <Legend 
                        payload={legendPayload} 
                        wrapperStyle={{ fontSize: "12px", paddingTop: '20px', direction: 'rtl' }} 
                        iconSize={10}
                    />
                    
                    {/* ترتیب نمایش از پایین به بالا در پشته */}
                    <Bar dataKey="incorrectPercent" stackId="a" fill="url(#gradientIncorrect)" name="پاسخ نادرست" radius={[0, 0, 6, 6]} />
                    <Bar dataKey="unansweredPercent" stackId="a" fill="url(#gradientUnanswered)" name="بدون پاسخ" />
                    <Bar dataKey="correctPercent" stackId="a" fill="url(#gradientCorrect)" name="پاسخ درست" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* پِیجینِیشِن برای نمودار با استفاده از کامپوننت شما */}
              {numChartPages > 1 && (
                <div className="flex justify-center items-center mt-auto pt-4 border-t border-gray-200">
                  <Pagination
                    currentPage={currentChartPage}
                    totalPages={numChartPages}
                    onPageChange={handleChartPageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* دیگر نیازی به استایل اسکرول بار افقی نیست چون از پِیجینِیشِن استفاده می‌کنیم */}
    </div>
  );
}