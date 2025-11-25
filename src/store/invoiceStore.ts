import { create } from "zustand";

interface InvoiceStore {
  invoices: IInvoice[];
  isOcring: boolean;
  setInvoices: (bills: IInvoice[]) => void;
  addInvoice: (bill: IInvoice) => void;
  // addAIInvoice: (aiInvoice: IAIInvoice) => void;
  setOcring: (isOcring: boolean) => void;
}

export function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// function transformAIInvoiceToIInvoice(aiInvoice?: IAIInvoice | null): IInvoice {
//   const now = new Date().toISOString();

//   const safeNumber = (n: number | undefined | null): number => Number(n ?? 0);
//   const safeString = (s: string | undefined | null): string => String(s ?? "");
//   const safeBool = (b: boolean | undefined | null): boolean => Boolean(b);

//   return {
//     id: uuid(),
//     currency: safeString(aiInvoice?.doc?.currency),
//     paymentMethod: safeString(aiInvoice?.doc?.payment_method),
//     notes: safeString(aiInvoice?.doc?.notes),
//     issuedDate: convertDate(aiInvoice?.datetime?.date ?? ""),
//     issuedTime: convertTime(aiInvoice?.datetime?.time ?? ""),
//     subtotal: safeNumber(aiInvoice?.totals?.subtotal).toFixed(2),
//     discount: safeNumber(aiInvoice?.totals?.discount).toFixed(2),
//     tax: safeNumber(aiInvoice?.totals?.tax).toFixed(2),
//     grandTotal: safeNumber(aiInvoice?.totals?.grand_total).toFixed(2),
//     createdAt: now,
//     updatedAt: now,

//     items: (aiInvoice?.items ?? []).map((item) => ({
//       id: uuid(),
//       rawName: safeString(item?.raw_name),
//       brand: safeString(item?.brand),
//       category: item?.category ?? null,
//       plantBased: safeBool(item?.plant_based),
//       quantity: safeNumber(item?.quantity),
//       unitPrice: safeNumber(item?.unit_price).toFixed(2),
//       lineTotal: safeNumber(item?.line_total).toFixed(2),
//       matchedShoppingList: safeBool(item?.matched_shopping_list),
//     })),

//     vendor: {
//       id: uuid(),
//       name: safeString(aiInvoice?.vendor?.name),
//       address: safeString(aiInvoice?.vendor?.address),
//       geoHint: safeString(aiInvoice?.vendor?.geo_hint),
//     },

//     scans: null,

//     user: {
//       id: "",
//       username: "",
//       email: "",
//       phoneNumber: null,
//       fullName: "",
//       role: "user",
//       dateOfBirth: "",
//       createdAt: now,
//       updatedAt: now,
//     },
//   };
// }

// --- Helpers ---

// function convertDate(ddmmyyyy: string): string {
//   // fallback: nếu không đúng định dạng, trả luôn chuỗi gốc hoặc ngày hiện tại
//   if (!ddmmyyyy.includes("/")) return new Date().toISOString().split("T")[0];
//   const [day, month, year] = ddmmyyyy.split("/");
//   if (!day || !month || !year) return new Date().toISOString().split("T")[0];
//   return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
// }

// function convertTime(hhmm: string): string {
//   if (!hhmm.includes(":")) return "00:00:00";
//   const [h, m] = hhmm.split(":");
//   return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:00`;
// }

const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: [],
  isOcring: false,
  setInvoices: (invoices) => set({ invoices }),
  addInvoice: (invoice) => set((state) => ({ invoices: [invoice, ...state.invoices] })),
  setOcring: (isOcring) => set({ isOcring }),
}));

export default useInvoiceStore;
