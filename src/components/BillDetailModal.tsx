import React from "react";
import type { IBill } from "@/store/billStore";

interface BillDetailModalProps {
  bill: IBill | null;
  open: boolean;
  onClose: () => void;
}

import { useState } from "react";
import useBillStore from "@/store/billStore";

export default function BillDetailModal({ bill, open, onClose }: BillDetailModalProps) {
  const bills = useBillStore(state => state.bills);
  const updateBills = useBillStore(state => state.setBills);
  const [isEdit, setIsEdit] = useState(false);
  const [editBill, setEditBill] = useState<IBill | null>(null);

  // Khi mở modal mới, reset state edit
  // eslint-disable-next-line
  if (open && !isEdit && editBill !== bill) setEditBill(bill);

  if (!bill) return null;
  if (!open) return null;

  const handleSave = () => {
    if (!editBill) return;
    const newBills = bills.map(b => b === bill ? editBill : b);
    updateBills(newBills);
    setIsEdit(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-lg font-bold mb-2 text-greenery-700">Bill Details</h2>
        <div className="space-y-3">
          {isEdit ? (
            <>
              <div>
                <input
                  className="font-semibold border-b w-full mb-1"
                  value={editBill?.vendor.name || ""}
                  onChange={e => setEditBill(editBill && { ...editBill, vendor: { ...editBill.vendor, name: e.target.value } })}
                />
                <input
                  className="text-xs text-gray-500 border-b w-full mb-1"
                  value={editBill?.vendor.address || ""}
                  onChange={e => setEditBill(editBill && { ...editBill, vendor: { ...editBill.vendor, address: e.target.value, geo_hint: editBill.vendor.geo_hint } })}
                />
                <div className="text-xs text-gray-400">{editBill?.datetime.date} {editBill?.datetime.time}</div>
              </div>
              <div>
                <div className="font-medium mb-1">Items:</div>
                <ul className="space-y-1">
                  {editBill?.items.map((item, idx) => (
                    <li key={idx} className="flex flex-wrap gap-1 items-center text-sm">
                      <input
                        className="border-b flex-1 min-w-[80px] max-w-[120px]"
                        value={item.brand || item.raw_name}
                        onChange={e => {
                          const items = editBill.items.slice();
                          items[idx] = { ...item, brand: e.target.value };
                          setEditBill({ ...editBill, items });
                        }}
                        placeholder="Item name"
                      />
                      <input
                        type="number"
                        className="border-b w-12 text-right"
                        value={item.quantity}
                        min={1}
                        onChange={e => {
                          const items = editBill.items.slice();
                          items[idx] = { ...item, quantity: Number(e.target.value) };
                          setEditBill({ ...editBill, items });
                        }}
                        placeholder="Qty"
                      />
                      <input
                        type="number"
                        className="border-b w-16 text-right"
                        value={item.line_total}
                        min={0}
                        onChange={e => {
                          const items = editBill.items.slice();
                          items[idx] = { ...item, line_total: Number(e.target.value) };
                          setEditBill({ ...editBill, items });
                        }}
                        placeholder="Price"
                      />
                      <span className="ml-1">{editBill.doc.currency}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>{editBill?.totals.grand_total.toLocaleString()} {editBill?.doc.currency}</span>
              </div>
              <textarea
                className="text-xs text-gray-500 mt-2 border rounded w-full p-1"
                value={editBill?.doc.notes || ""}
                onChange={e => setEditBill(editBill && { ...editBill, doc: { ...editBill.doc, notes: e.target.value } })}
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
                <div className="font-semibold">{bill.vendor.name}</div>
                <div className="text-xs text-gray-500">{bill.vendor.address}</div>
                <div className="text-xs text-gray-400">{bill.datetime.date} {bill.datetime.time}</div>
              </div>
              <div>
                <div className="font-medium mb-1">Items:</div>
                <ul className="space-y-1">
                  {bill.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span>{item.brand || item.raw_name} x{item.quantity}</span>
                      <span>{item.line_total.toLocaleString()} {bill.doc.currency}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>{bill.totals.grand_total.toLocaleString()} {bill.doc.currency}</span>
              </div>
              {bill.doc.notes && (
                <div className="text-xs text-gray-500 mt-2">Notes: {bill.doc.notes}</div>
              )}
              <button className="mt-4 w-full py-2 rounded bg-blue-500 text-white font-semibold" onClick={() => setIsEdit(true)}>Edit</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
