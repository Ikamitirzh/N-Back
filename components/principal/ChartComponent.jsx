// src/components/principal/ChartComponent.jsx
'use client';
import { useState, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 2;

const ChartComponent = ({ reportData }) => {
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);

  // داده‌ها برای چارت میله‌ای
  const barChartData = reportData.map(item => ({
    name: `سوال ${item.termId - 1}`,
    درست: item.correctAnswers,
    غلط: item.incorrectAnswers,
    بی‌پاسخ: item.unansweredTerms,
  }));

  // داده‌ها برای چارت دایره‌ای با تنظیم رنگ پویا
  const pieChartData = currentPageData => {
    if (!currentPageData.length) return [];
    const totalCorrect = currentPageData.reduce((sum, item) => sum + item.درست, 0);
    const totalIncorrect = currentPageData.reduce((sum, item) => sum + item.غلط, 0);
    const totalUnanswered = currentPageData.reduce((sum, item) => sum + item.بی‌پاسخ, 0);
    const total = totalCorrect + totalIncorrect + totalUnanswered;

    const data = [
      { name: 'درست', value: totalCorrect, percentage: ((totalCorrect / total) * 100).toFixed(1) },
      { name: 'غلط', value: totalIncorrect, percentage: ((totalIncorrect / total) * 100).toFixed(1) },
      { name: 'بی‌پاسخ', value: totalUnanswered, percentage: ((totalUnanswered / total) * 100).toFixed(1) },
    ].filter(item => item.value > 0);

    // تنظیم رنگ پویا بر اساس name
    return data.map(item => {
      let color;
      if (item.name === 'درست') color = '#2262C6'; // سبز
      else if (item.name === 'غلط') color = '#ef4444'; // قرمز
      else if (item.name === 'بی‌پاسخ') color = '#facc15'; // زرد
      return { ...item, color };
    });
  };

  const pageCount = Math.ceil(barChartData.length / ITEMS_PER_PAGE);
  const currentPageData = barChartData.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const COLORS = ['#2262C6', '#ef4444', '#facc15'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-lg">
          <p className="text-sm">{` ${payload[0].payload.name}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // رندر برچسب سفارشی برای چارت دایره‌ای
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, payload }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={payload.color} // استفاده از رنگ پویا
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${percentage}%`}
      </text>
    );
  };

  const next = () => {
    setPage(prev => Math.min(prev + 1, pageCount - 1));
  };

  const prev = () => {
    setPage(prev => Math.max(prev - 1, 0));
  };

  // انیمیشن برای هر چارت
  const chartVariants = {
    initial: { opacity: 0, y: -50 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, type: 'spring', stiffness: 120, damping: 15 },
    }),
    exit: (i) => ({
      opacity: 0,
      y: 50,
      x: 50,
      transition: { delay: i * 0.2, duration: 0.3, ease: 'easeOut' },
    }),
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          className="flex flex-col md:flex-row justify-center items-center gap-6"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* چارت میله‌ای */}
          {currentPageData.map((data, index) => (
            <motion.div
              key={`${page}-${data.name}`}
              custom={index}
              variants={chartVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-lg shadow-md flex justify-center "
            >
              <div>
                <h3 className="text-lg font-semibold text-center text-gray-700 mb-4">{data.name}</h3>
                <BarChart
                  width={300}
                  height={300}
                  data={[data]}
                  margin={{ top: 20, right: 30,  bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis
                    stroke="#6b7280"
                    tickMargin={40}
                    domain={[0, 'auto']}
                    tickFormatter={(value) => value.toFixed(2)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: 10, marginLeft: 30, paddingLeft: 10}} />
                  <Bar dataKey="درست" fill={COLORS[0]} barSize={30} radius={[10, 10, 0, 0]} />
                  <Bar dataKey="غلط" fill={COLORS[1]} barSize={30} radius={[10, 10, 0, 0]} />
                  <Bar dataKey="بی‌پاسخ" fill={COLORS[2]} barSize={30} radius={[10, 10, 0, 0]} />
                </BarChart>
              </div>
            </motion.div>
          ))}
          {/* چارت دایره‌ای */}
          <motion.div
            key={`${page}-pie`}
            custom={currentPageData.length}
            variants={chartVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-lg shadow-md flex justify-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-center text-gray-700 mb-4">تحلیل کلی</h3>
              <PieChart width={280} height={300}>
                <Pie
                  data={pieChartData(currentPageData)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                  labelLine={{ stroke: '#888', strokeWidth: 1, length: 20, length2: 10 }}
                >
                  {pieChartData(currentPageData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} (${name})`, name]} />
                <Legend wrapperStyle={{ paddingTop: 10}} />
              </PieChart>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={prev}
          disabled={page === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition duration-200"
        >
          قبلی
        </button>
        <button
          onClick={next}
          disabled={page === pageCount - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition duration-200"
        >
          بعدی
        </button>
      </div>
    </div>
  );
};

export default ChartComponent;