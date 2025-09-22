
import React from "react";
interface BillCardProps {
  bill: any;
  onClick?: () => void;
}

const BillCard: React.FC<BillCardProps> = ({ bill, onClick }) => (
  <li
    className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-greenery-100 cursor-pointer hover:bg-greenery-50 transition"
    onClick={onClick}
  >
    <div className="flex justify-between items-center">
      <div>
        <div className="font-semibold text-greenery-700">{bill.vendor.name}</div>
        <div className="text-xs text-gray-500">{bill.vendor.address}</div>
      </div>
      <div className="text-xs text-gray-400">{bill.datetime.date} {bill.datetime.time}</div>
    </div>
    <div className="flex flex-wrap gap-2 mt-2">
      {bill.items.slice(0, 3).map((item: any, idx: number) => (
        <span
          key={idx}
          className="bg-greenery-50 text-greenery-700 px-2 py-1 rounded text-xs font-medium"
        >
          {item.raw_name.slice(0, 5) + "..."} x{item.quantity}
        </span>
      ))}
      {bill.items.length > 3 && (
        <span className="text-xs text-gray-400">
          +{bill.items.length - 3} more
        </span>
      )}
    </div>
    <div className="flex justify-between items-center mt-2">
      <span className="text-sm text-gray-600">Total</span>
      <span className="font-bold text-greenery-700">
        {bill.totals.grand_total.toLocaleString()} {bill.doc.currency}
      </span>
    </div>
  </li>
);

export default BillCard;
