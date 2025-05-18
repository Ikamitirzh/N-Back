import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function ProvinceSearchSelect({ options, value, onChange, label = "استان" }) {
  const [search, setSearch] = useState("");
  const filteredOptions = options.filter((opt) => opt.name.includes(search));

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full p-2 border rounded text-right">
            {value ? options.find((o) => o.id === value)?.name : `انتخاب ${label}`}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <input
            className="w-full mb-2 p-1 border rounded"
            placeholder={`جستجوی ${label}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-40 overflow-y-auto space-y-1">
            {filteredOptions.map((option) => (
              <div
                key={option.id}
                className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                onClick={() => {
                  onChange(option.id);
                  setSearch("");
                }}
              >
                {option.name}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
