
import React from "react";
import { useNavigate } from "react-router-dom";
import BillCard from "@/components/BillCard";

interface BillListProps {
  bills: any[];
}

const BillList: React.FC<BillListProps> = ({ bills }) => {
  const navigate = useNavigate();
  if (!bills.length) {
    return (
      <div className="text-center text-gray-400 mt-16">
        No bills scanned yet.
      </div>
    );
  }
  return (
    <ul className="grid gap-4 mt-2 grid-cols-1 sm:grid-cols-1 lg:grid-cols-1">
      {bills.map((bill) => (
        <BillCard
          key={bill.id}
          bill={bill}
          onClick={() => navigate(`/bill-detail/${bill.id}`)}
        />
      ))}
    </ul>
  );
};

export default BillList;
