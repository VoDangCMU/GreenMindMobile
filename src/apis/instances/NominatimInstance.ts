import axios from "axios";

const NominatimInstance = axios.create({
  baseURL: "https://nominatim.openstreetmap.org",
  headers: {
    "Accept": "application/json",
    "User-Agent": "GreenMindMobile/1.0 (vodang.team@gmail.com)"
  },
  timeout: 10000,
});

export default NominatimInstance;
