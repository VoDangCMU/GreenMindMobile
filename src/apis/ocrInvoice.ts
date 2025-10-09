import type { Photo } from "@capacitor/camera";
import fileUtils from "../helpers/fileUtils";
import AIApi from "./instances/AIInstance";

export interface IAIInvoiceDoc {
  source_id: string;
  currency: string;
  payment_method: string;
  notes: string;
}

export interface IAIInvoiceVendor {
  name: string;
  address: string;
  geo_hint: string;
}

export interface IAIInvoiceDatetime {
  date: string; // format dd/MM/yyyy
  time: string; // format HH:mm
}

export interface IAIInvoiceItem {
  raw_name: string;
  brand: string | null;
  category: string;
  plant_based: boolean;
  quantity: number;
  unit_price: number;
  line_total: number;
  matched_shopping_list: boolean;
}

export interface IAIInvoiceTotals {
  subtotal: number;
  discount: number;
  tax: number;
  grand_total: number;
}

export interface IAIInvoice {
  doc: IAIInvoiceDoc;
  vendor: IAIInvoiceVendor;
  datetime: IAIInvoiceDatetime;
  items: IAIInvoiceItem[];
  totals: IAIInvoiceTotals;
}


export default async function ocrBill(photo: Photo) {

  let imageFile: File | null = null;
  if (photo.path) {
    imageFile = await fileUtils.imageFileFromPath(photo.path);
  } else if (photo.webPath) {
    imageFile = await fileUtils.imageFileFromWebURL(photo.webPath);
  }

  if (imageFile === null) {
    throw new Error("Failed to create image file from photo.");
  }

  const formData = new FormData();
  formData.append("file", imageFile);

  return AIApi.post('/ocr_text', formData).then(res => res.data as IAIInvoice);
}