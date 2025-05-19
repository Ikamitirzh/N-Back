import { Search } from "lucide-react";

interface SchoolFiltersProps {
  filters: { level: string; city: string };
  searchQuery: string;
  onFilterChange: (filters: { level: string; city: string }) => void;
  onSearchChange: (query: string) => void;
}

export default function SchoolFilters({
  filters,
  searchQuery,
  onFilterChange,
  onSearchChange,
}: SchoolFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[250px]">
        <div className="relative">
          <input
            type="text"
            placeholder="جستجو..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-100 p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="flex-1 min-w-[150px]">
        <select
          value={filters.level}
          onChange={(e) => onFilterChange({ ...filters, level: e.target.value })}
          className="w-full bg-gray-100 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">همه مقاطع</option>
          <option value="ابتدایی">ابتدایی</option>
          <option value="متوسطه اول">متوسطه اول</option>
          <option value="متوسطه دوم">متوسطه دوم</option>
        </select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <select
          value={filters.city}
          onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
          className="w-full bg-gray-100 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">همه شهرها</option>
          <option value="تهران">تهران</option>
          <option value="مشهد">مشهد</option>
          <option value="اصفهان">اصفهان</option>
        </select>
      </div>
    </div>
  );
}