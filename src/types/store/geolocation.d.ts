declare interface IGeolocationPosition {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
    timestamp: number;
}

declare interface IGeolocationState {
    currentPosition: IGeolocationPosition | null;
    currentPositionDisplayName?: string | null;
    isTracking: boolean;
    lastUpdate: Date | null;
    error: string | null;
    positionHistory: IGeolocationPosition[];
    // Actions
    setPosition: (position: IGeolocationPosition) => void;
    setCurrentLocationDisplayName: (displayName: string) => void;
    setTracking: (isTracking: boolean) => void;
    setError: (error: string | null) => void;
    clearPosition: () => void;
    clearHistory: () => void;
}