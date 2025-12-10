declare interface HomeLocation {
  latitude: number;
  longitude: number;
  address: string;
}

declare interface NightOutStatus {
  isNightOut: boolean;
  lastDetectedTime: string | null;
  distanceFromHome: number | null;
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  lastCheckTime?: string | null;
}

declare interface IAppState {
  ocean: IOcean | null;
  homeLocation: HomeLocation | null;
  nightOutStatus: NightOutStatus;
  // Actions
  setOcean: (scores: OceanScores) => void;
  setHomeLocation: (location: HomeLocation) => void;
  setNightOutStatus: (status: Partial<NightOutStatus>) => void;
}