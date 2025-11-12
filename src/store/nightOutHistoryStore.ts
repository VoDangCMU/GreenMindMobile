import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NightOutRecord {
  date: string; // Format: YYYY-MM-DD
  timestamp: string; // ISO string of when first detected
  distanceFromHome: number; // Distance in km when first detected
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface NightOutHistoryState {
  records: NightOutRecord[];
  // Actions
  addNightOutRecord: (record: Omit<NightOutRecord, 'date'>) => void;
  hasNightOutToday: () => boolean;
  getNightOutRecords: (startDate?: string, endDate?: string) => NightOutRecord[];
  getTotalNightOutDays: () => number;
  clearHistory: () => void;
}

export const useNightOutHistoryStore = create<NightOutHistoryState>()(
  persist(
    (set, get) => ({
      records: [],
      
      addNightOutRecord: (record) => {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const existingRecords = get().records;
        
        // Check if already have a record for today
        const existsToday = existingRecords.some(r => r.date === today);
        
        if (!existsToday) {
          const newRecord: NightOutRecord = {
            date: today,
            timestamp: record.timestamp,
            distanceFromHome: record.distanceFromHome,
            location: record.location,
          };
          
          set((state) => ({
            records: [...state.records, newRecord].sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            ), // Sort by date descending (newest first)
          }));
        }
      },
      
      hasNightOutToday: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().records.some(record => record.date === today);
      },
      
      getNightOutRecords: (startDate, endDate) => {
        const records = get().records;
        
        if (!startDate && !endDate) {
          return records;
        }
        
        return records.filter(record => {
          const recordDate = new Date(record.date);
          const start = startDate ? new Date(startDate) : new Date('1900-01-01');
          const end = endDate ? new Date(endDate) : new Date('2100-12-31');
          
          return recordDate >= start && recordDate <= end;
        });
      },
      
      getTotalNightOutDays: () => {
        return get().records.length;
      },
      
      clearHistory: () => {
        set({ records: [] });
      },
    }),
    {
      name: "greenmind_night_out_history",
    }
  )
);