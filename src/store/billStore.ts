import { create } from "zustand";

// ---- Interfaces ----
interface IBillDoc {
  source_id: string;
  currency: string;
  payment_method: string;
  notes: string;
}

interface IBillVendor {
  name: string;
  address: string;
  geo_hint: string;
}

interface IBillDatetime {
  date: string; // format dd/MM/yyyy
  time: string; // format HH:mm
}

interface IBillItem {
  raw_name: string;
  brand: string | null;
  category: string;
  plant_based: boolean;
  quantity: number;
  unit_price: number;
  line_total: number;
  matched_shopping_list: boolean;
}

interface IBillTotals {
  subtotal: number;
  discount: number;
  tax: number;
  grand_total: number;
}

export interface IBill {
  doc: IBillDoc;
  vendor: IBillVendor;
  datetime: IBillDatetime;
  items: IBillItem[];
  totals: IBillTotals;
}

// ---- Store type ----
interface BillStore {
  bills: IBill[];
  setBills: (bills: IBill[]) => void;
  addBill: (bill: IBill) => void;
}

// ---- Zustand store ----
const useBillStore = create<BillStore>((set) => ({
  bills: [],
  setBills: (bills) => set({ bills }),
  addBill: (bill) => set((state) => ({ bills: [bill, ...state.bills] })),
}));

export default useBillStore;
