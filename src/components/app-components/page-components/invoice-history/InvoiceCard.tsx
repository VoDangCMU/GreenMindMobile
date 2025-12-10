import React from "react";

interface InvoiceCardProps {
  invoice: IInvoice;
  onClick?: () => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onClick }) => (
  <li
    className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-greenery-100 cursor-pointer hover:bg-greenery-50 transition"
    onClick={onClick}
  >
    <div className="flex justify-between items-center">
      <div>
        <div className="font-semibold text-greenery-700">{invoice.vendor.name}</div>
        <div className="text-xs text-gray-500">{invoice.vendor.address}</div>
      </div>
      <div className="text-xs text-gray-400">{invoice.datetime.date} {invoice.datetime.time}</div>
    </div>
    <div className="flex flex-wrap gap-2 mt-2">
      {invoice.items.map((item: IInvoiceItem, idx: number) => (
        <span
          key={idx}
          className="bg-greenery-50 text-greenery-700 px-2 py-1 rounded text-xs font-medium"
        >
          {item.raw_name.slice(0, 5) + "..."} x{item.quantity}
        </span>
      ))}
      {invoice.items.length > 3 && (
        <span className="text-xs text-gray-400">
          +{invoice.items.length - 3} more
        </span>
      )}
    </div>
    <div className="flex justify-between items-center mt-2">
      <span className="text-sm text-gray-600">Total</span>
      <span className="font-bold text-greenery-700">
        {invoice.totals.grand_total.toLocaleString()} {invoice.doc.currency}
      </span>
    </div>
  </li>
);

export default InvoiceCard;
