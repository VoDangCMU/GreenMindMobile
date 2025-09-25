
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BillCard from "@/components/BillCard";

interface BillListProps {
  bills: any[];
}

const BillList: React.FC<BillListProps> = ({ bills }) => {
  const [selectedBill, setSelectedBill] = useState<any | null>(null);
  if (!bills.length) {
    return (
      <div className="text-center text-gray-400 mt-16">
        No bills scanned yet.
      </div>
    );
  }
  return (
    <>
      <ul className="grid gap-4 mt-2 grid-cols-1 sm:grid-cols-1 lg:grid-cols-1">
        {bills.map((bill) => (
          <BillCard
            key={bill.id}
            bill={bill}
            onClick={() => setSelectedBill(bill)}
          />
        ))}
      </ul>
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelectedBill(null)}>
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl" onClick={() => setSelectedBill(null)}>&times;</button>
            <h2 className="text-lg font-bold mb-2 text-greenery-700">Bill Details</h2>
            <pre className="text-xs bg-gray-50 rounded p-2 overflow-x-auto max-h-96">{JSON.stringify(selectedBill, null, 2)}</pre>
          </div>
        </div>
      )}
    </>
  );
};

export default BillList;
