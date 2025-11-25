import BackendInstance from "../instances/BackendInstance";
import { authHeader } from "../instances/getToken";

export async function getInvoices(): Promise<IInvoice[]> {
  const res = await BackendInstance.get("/ocr/invoices", { headers: authHeader() });
  return res.data as IInvoice[];
}

export default {
  getInvoices,
}