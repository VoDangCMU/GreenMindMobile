import type { IBill } from "@/store/billStore";
import BackendInstance from "./instances/BackendInstance";

import { storageKey } from "@/store/appStore";

function getToken() {
	return localStorage.getItem(storageKey) ? JSON.parse(localStorage.getItem(storageKey)!).access_token : null;
}

function authHeader(): Record<string, string> {
	const token = getToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getInvoices() {
	const res = await BackendInstance.get("/invoices/get-invoices", { headers: authHeader() });
	return res.data as IBill[];
}

export async function getInvoicesByUserId(userId: string) {
		const res = await BackendInstance.get(`/invoices/get-invoices-by-user/${userId}`, { headers: authHeader() });
	return res.data as IBill;
}

export async function getInvoiceById(id: string) {
		const res = await BackendInstance.get(`/invoices/get-invoice/${id}`, { headers: authHeader() });
	return res.data as IBill;
}

// Mock ScanID = 001 for now
export async function createInvoice(data: IBill) {
		const res = await BackendInstance.post("/invoices/create-invoice", {...data, scanId: "001"}, { headers: authHeader() });
	return res.data as IBill;
}

export default {
	getInvoices,
	getInvoicesByUserId,
	getInvoiceById,
	createInvoice,
}

// export async function updateInvoice(id: string, data: Partial<IBill>) {
// 		const res = await fetch(`${API_BASE}/invoices/update-invoice/${id}`, {
// 			method: "PUT",
// 			headers: {
// 				"Content-Type": "application/json",
// 				...authHeader(),
// 			} as Record<string, string>,
// 			body: JSON.stringify(data),
// 		});
// 	if (!res.ok) throw new Error("Failed to update invoice");
// 	return res.json();
// }

// export async function deleteInvoice(id: string) {
// 		const res = await fetch(`${API_BASE}/invoices/delete-invoice/${id}`, {
// 			method: "DELETE",
// 			headers: authHeader(),
// 		});
// 	if (!res.ok) throw new Error("Failed to delete invoice");
// 	return res.json();
// }
