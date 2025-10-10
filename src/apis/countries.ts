import countriesData from "@/assets/countries.json";
import citiesData from "@/assets/cities.json";

interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  capital: string;
  region: string;
  subregion: string;
  latitude: string;
  longitude: string;
  currency: string;
  currency_name: string;
  emoji: string;
  phonecode: string;
}

interface City {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  state_name: string;
  latitude: string;
  longitude: string;
}

const countries = countriesData as Country[];
const cities = citiesData as City[];

/* 🗺️ ========== COUNTRIES ========== */

// Lấy quốc gia theo tên (trả về mảng, có thể hiển thị trong Popover)
export const getCountriesByName = (query: string): Country[] => {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return countries.filter(c => c.name.toLowerCase().includes(lower));
};

// Lấy quốc gia theo mã (iso2 hoặc iso3)
export const getCountryByCode = (code: string): Country | undefined =>
  countries.find(
    c => c.iso2.toLowerCase() === code.toLowerCase() ||
         c.iso3.toLowerCase() === code.toLowerCase()
  );

// Trả về danh sách quốc gia theo mã hoặc tên (tự phát hiện kiểu đầu vào)
export const getCountries = (input: string): Country[] => {
  if (!input.trim()) return [];
  const lower = input.toLowerCase();
  return countries.filter(
    c =>
      c.name.toLowerCase().includes(lower) ||
      c.iso2.toLowerCase() === lower ||
      c.iso3.toLowerCase() === lower
  );
};

// Trả về danh sách tên quốc gia để hiển thị Popover
export const getCountryNames = (): string[] => countries.map(c => c.name);

/* 🌆 ========== CITIES ========== */

// Lấy danh sách thành phố theo tên
export const getCitiesByName = (query: string): City[] => {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return cities.filter(c => c.name.toLowerCase().includes(lower));
};

// Lấy danh sách thành phố theo mã quốc gia (iso2 hoặc iso3)
export const getCitiesByCountryCode = (code: string): City[] => {
  const lower = code.toLowerCase();
  return cities.filter(c => c.country_code.toLowerCase() === lower);
};

// Trả về danh sách thành phố theo mã hoặc tên
export const getCities = (input: string): City[] => {
  if (!input.trim()) return [];
  const lower = input.toLowerCase();
  return cities.filter(
    c =>
      c.name.toLowerCase().includes(lower) ||
      c.country_code.toLowerCase() === lower
  );
};

// Trả về danh sách tên thành phố để hiển thị Popover
export const getCityNames = (): string[] => cities.map(c => c.name);

// 🏙️ Lấy danh sách thành phố theo quốc gia (tên hoặc mã)
export const getCitiesByCountry = (country: string): City[] => {
  if (!country.trim()) return [];

  const lower = country.toLowerCase().trim();

  // Tìm country object theo tên hoặc mã
  const match = countries.find(
    c =>
      c.name.toLowerCase() === lower ||
      c.iso2.toLowerCase() === lower ||
      c.iso3.toLowerCase() === lower
  );

  if (!match) return [];

  // Lọc cities theo country_id hoặc country_code
  return cities.filter(
    city =>
      city.country_id === match.id ||
      city.country_code.toLowerCase() === match.iso2.toLowerCase()
  );
};


/* 🌍 ========== UTILITIES ========== */

// Lấy toàn bộ
export const getAllCountries = (): Country[] => countries;
export const getAllCities = (): City[] => cities;
