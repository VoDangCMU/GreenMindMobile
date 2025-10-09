import { useState } from "react";
import useBillStore from "@/store/invoiceStore";
import type { IInvoice, IInvoiceItem } from "@/apis/invoice";
import invoiceApi from "@/apis/invoice";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface InvoiceDetailModalProps {
  invoice: IInvoice | null;
  open: boolean;
  onClose: () => void;
}

export default function InvoiceDetailModal({ invoice, open, onClose }: InvoiceDetailModalProps) {
  const invoices = useBillStore(state => state.invoices);
  const updateInvoices = useBillStore(state => state.setInvoices);
  const [isEdit, setIsEdit] = useState(false);
  const [editInvoice, setEditInvoice] = useState<IInvoice | null>(null);

  // Khi mở modal mới, reset state edit
  // eslint-disable-next-line
  if (open && !isEdit && editInvoice !== invoice) setEditInvoice(invoice);

  if (!invoice) return null;
  if (!open) return null;

  const handleSave = () => {
    if (!editInvoice) return;
    const newBills = invoices.map(b => b === invoice ? editInvoice : b);
    updateInvoices(newBills);
    setIsEdit(false);
    onClose();
  };

  const handleDelete = () => {
    if (!invoice) return;
    invoiceApi.deleteInvoice(invoice.id).then(() => {
      console.log("Invoice deleted:", invoice.id);
      toast.success("Invoice deleted successfully");
    }).catch(err => {
      console.error("Failed to delete invoice:", err);
    });
  };

  return (
    <div className="p-2 fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-lg font-bold mb-2 text-greenery-700">Bill Details</h2>
        <div className="space-y-3">
          {isEdit ? (
            <>
              <div>
                <input
                  className="font-semibold border-b w-full mb-1"
                  value={editInvoice?.vendor.name || ""}
                  onChange={e => setEditInvoice(editInvoice && { ...editInvoice, vendor: { ...editInvoice.vendor, name: e.target.value } })}
                />
                <input
                  className="text-xs text-gray-500 border-b w-full mb-1"
                  value={editInvoice?.vendor.address || ""}
                  onChange={e => setEditInvoice(editInvoice && { ...editInvoice, vendor: { ...editInvoice.vendor, address: e.target.value, geoHint: editInvoice.vendor.geoHint } })}
                />
                <div className="text-xs text-gray-400">{editInvoice?.issuedDate} {editInvoice?.issuedTime}</div>
              </div>
              <div>
                <div className="font-medium mb-1">Items:</div>
                <ul className="space-y-1">
                  {editInvoice?.items.map((item, idx) => (
                    <li key={idx} className="flex flex-wrap gap-1 items-center text-sm">
                      <input
                        className="border-b flex-1 min-w-[80px] max-w-[120px]"
                        value={item.brand || item.rawName}
                        onChange={e => {
                          const items = editInvoice.items.slice();
                          items[idx] = { ...item, brand: e.target.value };
                          setEditInvoice({ ...editInvoice, items });
                        }}
                        placeholder="Item name"
                      />
                      <input
                        type="number"
                        className="border-b w-12 text-right"
                        value={item.quantity}
                        min={1}
                        onChange={e => {
                          const items = editInvoice.items.slice();
                          items[idx] = { ...item, quantity: Number(e.target.value) };
                          setEditInvoice({ ...editInvoice, items });
                        }}
                        placeholder="Qty"
                      />
                      <input
                        type="number"
                        className="border-b w-16 text-right"
                        value={item.lineTotal}
                        min={0}
                        onChange={e => {
                          const items = editInvoice.items.slice();
                          items[idx] = { ...item, lineTotal: e.target.value };
                          setEditInvoice({ ...editInvoice, items });
                        }}
                        placeholder="Price"
                      />
                      <span className="ml-1">{editInvoice.currency}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>{editInvoice?.grandTotal.toLocaleString()} {editInvoice?.currency}</span>
              </div>
              <textarea
                className="text-xs text-gray-500 mt-2 border rounded w-full p-1"
                value={editInvoice?.notes || ""}
                onChange={e => setEditInvoice(editInvoice && { ...editInvoice, notes: e.target.value })}
                placeholder="Notes"
              />
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 rounded bg-gray-200 text-gray-700 font-semibold" onClick={() => setIsEdit(false)}>Cancel</button>
                <button className="flex-1 py-2 rounded bg-greenery-500 text-white font-semibold" onClick={handleSave}>Save</button>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="font-semibold">{invoice.vendor.name}</div>
                <div className="text-xs text-gray-500">{invoice.vendor.address}</div>
                <div className="text-xs text-gray-400">{invoice.issuedDate} {invoice.issuedTime}</div>
              </div>
              <div>
                <div className="font-medium mb-1">Items:</div>
                <ul className="space-y-1">
                  {invoice.items.map((item: IInvoiceItem, idx: number) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span>{item.brand || item.rawName} x{item.quantity}</span>
                      <span>{item.lineTotal.toLocaleString()} {invoice.currency}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>{invoice.grandTotal.toLocaleString()} {invoice.currency}</span>
              </div>
              {invoice.notes && (
                <div className="text-xs text-gray-500 mt-2">Notes: {invoice.notes}</div>
              )}
              <div className="flex gap-2 mt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="flex-1 py-2 rounded bg-red-500 text-white font-semibold">Delete</button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this invoice? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-500 text-white hover:bg-red-600" onClick={() => {
                        updateInvoices(invoices.filter(b => b !== invoice));
                        handleDelete();
                        onClose();
                      }}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <button className="flex-1 py-2 rounded bg-blue-500 text-white font-semibold" onClick={() => setIsEdit(true)}>Edit</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
