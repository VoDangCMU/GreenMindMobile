import type { IBill } from "@/store/billStore";
import BeAPI from "@/apis/instances/BackendInstance";

function getToken() {
	try {
		const raw = localStorage.getItem("greenmind_auth");
		if (!raw) return null;
		return JSON.parse(raw).access_token;
	} catch {
		return null;
	}
}

export async function getInvoices() {
	const token = getToken();
	const res = await BeAPI.get("/invoices/get-invoices", {
	headers: token ? { Authorization: token } : {},
  });
	return res.data;
}

export async function getInvoiceById(id: string) {
	const token = getToken();
	const res = await BeAPI.get(`/invoices/get-invoices-by-id/${id}`, {
	headers: token ? { Authorization: token } : {},
  });
	return res.data;
}

export async function createInvoice(data: IBill) {
	const token = getToken();
	const res = await BeAPI.post("/invoices/create-invoice", data, {
	headers: token ? { Authorization: token } : {},
  });
	return res.data;
}

export async function updateInvoice(id: string, data: Partial<IBill>) {
	const token = getToken();
	const res = await BeAPI.put(`/invoices/update-invoice/${id}`, data, {
	headers: token ? { Authorization: token } : {},
  });
	return res.data;
}

export async function deleteInvoice(id: string) {
	const token = getToken();
	const res = await BeAPI.delete(`/invoices/delete-invoice/${id}`, {
	headers: token ? { Authorization: token } : {},
  });
	return res.data;
}
