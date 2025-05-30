// components/ComboBox.jsx
'use client';
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
const BASE_URL = "https://localhost:7086";

export default function ComboBox({
  label,
  apiEndpoint,
  selectedValue,
  onChange,
  disabled = false,
  className = "",
  params = {}
}) {
  const { authApiClient} = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const comboBoxRef = useRef(null);
  const inputRef = useRef(null);

  
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (comboBoxRef.current && !comboBoxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
    useEffect(() => {
    if (isOpen && !disabled) {
        const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await authApiClient.get(`${BASE_URL}/api/v1/${apiEndpoint}`, {
            params: { ...params, SearchTerm: searchTerm }
            });
            setOptions(response.data.items || response.data);
        } catch (error) {
            console.error(`Error fetching ${label}:`, error);
        } finally {
            setIsLoading(false);
        }
        };

        fetchData(); 
    }
    }, [isOpen, disabled,searchTerm]); 

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm(option.name);
  };

  return (
    <div className={`relative ${className}`} ref={comboBoxRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={`انتخاب ${label}`}
          value={selectedValue?.name || searchTerm}
          onClick={toggleDropdown}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"
          }`}
          readOnly={!isOpen}
        />
        
        {isLoading && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="sticky top-0 bg-white p-2 border-b">
            <input
              type="text"
              placeholder={`جستجوی ${label}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md outline-none"
              autoFocus
            />
          </div>
          
          <ul>
            {isLoading ? (
              <li className="px-4 py-2 text-center text-gray-500">در حال بارگذاری...</li>
            ) : options.length > 0 ? (
              options.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-2 hover:bg-blue-100 cursor-pointer ${
                    selectedValue?.id === option.id ? "bg-blue-50" : ""
                  }`}
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