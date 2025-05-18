import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://localhost:7086";

export const useProvincesAndCities = () => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);

  // Fetch provinces
  const fetchProvinces = async (searchTerm = "") => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/admin/Provinces`, {
        params: { SearchTerm: searchTerm },
      });
      setProvinces(response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  // Fetch cities based on selected province
  const fetchCities = async (provinceId, searchTerm = "") => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/admin/Cities`, {
        params: { ProvinceId: provinceId, SearchTerm: searchTerm },
      });
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Handle province selection
  const handleProvinceChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setSelectedProvinceId(selectedId);
    fetchCities(selectedId);
  };

  // Handle search in provinces
  const handleProvinceSearch = (e) => {
    const searchTerm = e.target.value;
    fetchProvinces(searchTerm);
  };

  // Handle search in cities
  const handleCitySearch = (e) => {
    const searchTerm = e.target.value;
    if (selectedProvinceId !== null) {
      fetchCities(selectedProvinceId, searchTerm);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  return {
    provinces,
    cities,
    selectedProvinceId,
    handleProvinceChange,
    handleProvinceSearch,
    handleCitySearch,
  };
};