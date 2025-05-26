// ComboBox.jsx
import  { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
const BASE_URL = "https://localhost:7086"; // تغییر داده شود به صورت واقعی

export default function ComboBox({
  label,
  apiEndpoint,
  selectedValue,
  onChange,
  disabled = false,
  className = ""
}) {
  const { authApiClient} = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [internalValue, setInternalValue] = useState(null);
  // Sync selectedValue with selectedOption
   useEffect(() => {
  // فقط اگر selectedValue تغییر کرد و با internalValue متفاوت بود، آپدیت کنیم
  if (selectedValue && (!internalValue || selectedValue.id !== internalValue.id)) {
    setInternalValue(selectedValue);
    setSearchTerm(selectedValue.name);
  }
}, [selectedValue]);

  // Fetch options from API
  useEffect(() => {
    if (isOpen && !disabled) {
      const fetchOptions = async () => {
        try {
          const response = await authApiClient.get(`${BASE_URL}/api/v1/admin/${apiEndpoint}`, {
            params: { SearchTerm: searchTerm },
          });
          setOptions(response.data.items || response.data);
        } catch (error) {
          console.error(`Error fetching ${apiEndpoint}:`, error);
        }
      };
      fetchOptions();
    }
  }, [isOpen, searchTerm, apiEndpoint, disabled]);

  const filteredOptions = options.filter((option) =>
    option.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!searchTerm && !selectedOption) {
        setSearchTerm(""); // برای نمایش تمامی استان/شهر
      }
    }
  };

const handleSelect = (option) => {
  setInternalValue(option);
  setSearchTerm(option.name);
  if (onChange) {
    // ارسال کل object انتخاب شده به جای فقط مقدار
    onChange({
      id: option.id,
      name: option.name
    });
    console.log(option.id , option.name)
    
  }

  setIsOpen(false);
};

  return (
    <div className={`relative ${className}`}>
      

      <input
        type="text"
        placeholder={`انتخاب ${label}`}
        value={internalValue?.name || searchTerm}
        onClick={handleInputClick}
        readOnly
        className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
          <input
            type="text"
            placeholder={`جستجوی ${label}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border-b border-gray-200 outline-none"
            onClick={(e) => e.stopPropagation()}
          />
          <ul>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {option.name}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">موردی یافت نشد</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}