import NominatimInstance from "@/apis/instances/NominatimInstance";

export interface ReverseGeocodeResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: Record<string, string>;
  // ... các trường khác nếu cần
}

/**
 * Reverse geocode: lấy địa chỉ từ lat/lng
 * @param lat vĩ độ
 * @param lon kinh độ
 * @param language ngôn ngữ trả về (vi, en, ...)
 */
export async function reverseGeocode(lat: number, lon: number, language: string = "vi"): Promise<ReverseGeocodeResult> {
  const params = {
    lat,
    lon,
    format: "json",
    addressdetails: 1,
    "accept-language": language,
  };
  const res = await NominatimInstance.get<ReverseGeocodeResult>("/reverse", { params });
  return res.data;
}

export interface Address {
  city: string
  "ISO3166-2-lvl4": string
  country: string
  country_code: string
}

export interface GetGeocode {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  class: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  address: Address
  boundingbox: string[]
}

export async function getGeocode(location: string): Promise<ReverseGeocodeResult> {
  const res = await NominatimInstance.get<ReverseGeocodeResult>("/search", { 
    params: {
      q: location,
      format: "json",
      addressdetails: 1,
      limit: 1,
    }
  });
  return res.data;
}