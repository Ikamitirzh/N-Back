import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:7086";

export default function Autocomplete({ label, apiEndpoint, selectedValue, onChange }) {
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  console.log(options)

  // Fetch options based on search term
  const fetchOptions = async (apiEndpoint, searchTerm) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/admin/${apiEndpoint}`, {
        params: { SearchTerm: searchTerm },
      });
      console.log(`قزوین ${response}`)
      setOptions(response.data);
    } catch (error) {
      console.error(`Error fetching ${apiEndpoint}:`, error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchOptions(apiEndpoint, searchTerm);
    } else {
      setOptions([]);
    }
  }, [searchTerm, apiEndpoint]);

  return (
    <div className="relative">
      <label>{label}</label>
      <div
        className="w-full bg-gray-100 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          placeholder={label}
          value={selectedValue || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none"
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-md rounded-lg overflow-hidden max-h-48">
          {options.map((option) => (
            <div
              key={option.id}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                onChange(option.name);
                setSearchTerm(option.name);
                setIsOpen(false);
              }}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}