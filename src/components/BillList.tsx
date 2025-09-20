import React from "react";
import BillCard from "@/components/BillCard";

interface BillListProps {
  bills: any[];
}

const BillList: React.FC<BillListProps> = ({ bills }) => {
  if (!bills.length) {
    return (
      <div className="text-center text-gray-400 mt-16">
        No bills scanned yet.
      </div>
    );
  }
  return (
    <ul
      className="grid gap-4 mt-2 grid-cols-1 sm:grid-cols-1 lg:grid-cols-1"
    >
      {bills.map((bill) => (
        <BillCard key={bill.id} bill={bill} />
      ))}
    </ul>
  );
};

export default BillList;
