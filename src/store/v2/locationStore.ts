import { create } from "zustand";

export interface ILocation {
    latitude: number;
    longitude: number;
    name: string | undefined;
    issueAt?: Date | undefined;
}

export interface ILocationState {
    locationHistory?: ILocation[];
    currentLocation: ILocation | null;
    setCurrentLocation: (location: ILocation) => void;
    lastCalculatedlocation?: ILocation | null;
    setLastCalculatedlocation: (location: ILocation) => void;
}

const initialState: ILocationState = {
    locationHistory: [],
    currentLocation: null,
    setCurrentLocation: () => { },
    lastCalculatedlocation: null,
    setLastCalculatedlocation: () => { },
};

export const useLocationStore = create<ILocationState>((set) => ({
    ...initialState,
    setCurrentLocation: (location: ILocation) => {
        set({ 
            currentLocation: { ...location, issueAt: new Date() },  
            locationHistory: [{ ...location, issueAt: new Date() }, ...(initialState.locationHistory || [])].slice(0, 50)
         })
    },
    setLastCalculatedlocation: (location: ILocation) => set({ lastCalculatedlocation: { ...location, issueAt: new Date() } }),
}));