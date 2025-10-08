import type { IBill } from "@/store/billStore";

const API_BASE = process.env.VITE_API_URL || "";

function getToken() {
	return localStorage.getItem("greenmind_auth") ? JSON.parse(localStorage.getItem("greenmind_auth")!).access_token : null;
}

function authHeader(): Record<string, string> {
	const token = getToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getInvoices() {
		const res = await fetch(`${API_BASE}/invoices/get-invoices`, {
			headers: authHeader(),
		});
	if (!res.ok) throw new Error("Failed to fetch invoices");
	return res.json();
}

export async function getInvoiceById(id: string) {
		const res = await fetch(`${API_BASE}/invoices/get-invoices-by-id/${id}`, {
			headers: authHeader(),
		});
	if (!res.ok) throw new Error("Failed to fetch invoice");
	return res.json();
}

export async function createInvoice(data: IBill) {
		const res = await fetch(`${API_BASE}/invoices/create-invoice`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...authHeader(),
			} as Record<string, string>,
			body: JSON.stringify(data),
		});
	if (!res.ok) throw new Error("Failed to create invoice");
	return res.json();
}

export async function updateInvoice(id: string, data: Partial<IBill>) {
		const res = await fetch(`${API_BASE}/invoices/update-invoice/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...authHeader(),
			} as Record<string, string>,
			body: JSON.stringify(data),
		});
	if (!res.ok) throw new Error("Failed to update invoice");
	return res.json();
}

export async function deleteInvoice(id: string) {
		const res = await fetch(`${API_BASE}/invoices/delete-invoice/${id}`, {
			method: "DELETE",
			headers: authHeader(),
		});
	if (!res.ok) throw new Error("Failed to delete invoice");
	return res.json();
}
