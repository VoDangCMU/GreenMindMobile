import BackendInstance from "./instances/BackendInstance";
import { storageKey } from "@/store/appStore";
import type { IAIInvoice } from "./ocrInvoice";
export interface IInvoiceItem {
  id: string;
  rawName: string;
  brand: string;
  category: string | null;
  plantBased: boolean;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  matchedShoppingList: boolean;
}
export interface IInvoiceVendor {
  id: string;
  name: string;
  address: string;
  geoHint: string;
}

interface IUser {
  id: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  fullName: string;
  role: "user" | "admin" | string;
  dateOfBirth: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface IInvoice {
  id: string;
  currency: string;
  paymentMethod: string;
  notes: string;
  issuedDate: string; // format yyyy-MM-dd
  issuedTime: string; // format HH:mm:ss
  subtotal: string;
  discount: string;
  tax: string;
  grandTotal: string;
  createdAt: string;
  updatedAt: string;
  items: IInvoiceItem[];
  vendor: IInvoiceVendor;
  scans: unknown | null;
	user: IUser;
}

function getToken() {
	return localStorage.getItem(storageKey) ? JSON.parse(localStorage.getItem(storageKey)!).access_token : null;
}

function authHeader(): Record<string, string> {
	const token = getToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getInvoices() {
	const res = await BackendInstance.get("/invoices/get-invoices", { headers: authHeader() });
	return res.data as IInvoice[];
}

export async function getInvoicesByUserId(userId: string) {
		const res = await BackendInstance.get(`/invoices/get-invoices-by-user/${userId}`, { headers: authHeader() });
	return res.data.invoices as IInvoice[];
}

export async function getInvoiceById(id: string) {
		const res = await BackendInstance.get(`/invoices/get-invoice/${id}`, { headers: authHeader() });
	return res.data as IInvoice;
}

// Mock ScanID = 001 for now
export async function createInvoice(data: IAIInvoice) {
	const res = await BackendInstance.post("/invoices/create-invoice", data, {
	  headers: authHeader(),
  });
	return res.data.data as IInvoice;
}

export async function deleteInvoice(id: string) {
	const res = await BackendInstance.delete(`/invoices/delete-invoice/${id}`, { headers: authHeader() });
	return res.data.deleted as IInvoice;
}

export default {
	getInvoices,
	getInvoicesByUserId,
	getInvoiceById,
	createInvoice,
	deleteInvoice
}