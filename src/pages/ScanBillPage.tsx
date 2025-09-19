import React, { useState } from "react";

const mockBills = [
  {
    id: "0002",
    vendor: {
      name: "VINH NGUYEN RES",
      address: "355 Sur Van Hanl P.12, Q10",
      geo_hint: "Q10",
    },
    datetime: {
      date: "29/03/2019",
      time: "23:59",
    },
    items: [
      { raw_name: "Coca", brand: "Coca", quantity: 2, unit_price: 25000, line_total: 50000 },
      { raw_name: "Spnte", brand: "Sprite", quantity: 2, unit_price: 25000, line_total: 50000 },
      { raw_name: "Touc", brand: "Touc", quantity: 2, unit_price: 25000, line_total: 50000 },
      { raw_name: "Soda", brand: "Soda", quantity: 1, unit_price: 25000, line_total: 25000 },
    ],
    totals: {
      subtotal: 225000,
      discount: 0,
      tax: 0,
      grand_total: 225000,
    },
    doc: {
      notes: "Camon Quy Khach- Hen Gp lai",
      payment_method: "cash",
      currency: "VND",
    },
  },
];

export default function ScannedBillPage() {
  const [bills, setBills] = useState(mockBills);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setBills((prev) => [
        ...prev,
        { ...mockBills[0], id: Math.random().toString().slice(2, 8) },
      ]);
      setLoading(false);
    }, 800);
  };

  const handleImport = async () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setBills((prev) => [
        ...prev,
        { ...mockBills[0], id: Math.random().toString().slice(2, 8) },
      ]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-greenery-50 to-greenery-100">
      {/* Header */}
      <div className="w-full max-w-md mx-auto flex flex-row items-center pt-6 pb-2 px-3">
        <h1 className="flex-1 text-2xl font-bold text-greenery-700 text-center">Scanned Bills</h1>
        <span className="w-8" />
      </div>

      {/* Bill List */}
      <div className="flex-1 w-full max-w-md mx-auto px-3 pb-24">
        {bills.length === 0 ? (
          <div className="text-center text-gray-400 mt-16">No bills scanned yet.</div>
        ) : (
          <ul className="flex flex-col gap-4 mt-2">
            {bills.map((bill) => (
              <li
                key={bill.id}
                className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-greenery-100"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-greenery-700">{bill.vendor.name}</div>
                    <div className="text-xs text-gray-500">{bill.vendor.address}</div>
                  </div>
                  <div className="text-xs text-gray-400">{bill.datetime.date} {bill.datetime.time}</div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {bill.items.slice(0, 3).map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-greenery-50 text-greenery-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      {item.brand} x{item.quantity}
                    </span>
                  ))}
                  {bill.items.length > 3 && (
                    <span className="text-xs text-gray-400">+{bill.items.length - 3} more</span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="font-bold text-greenery-700">
                    {bill.totals.grand_total.toLocaleString()} {bill.doc.currency}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 border-t border-greenery-100 flex justify-between items-center px-6 py-3 max-w-md mx-auto"
        style={{ boxShadow: "0 -2px 16px 0 rgba(0,0,0,0.04)" }}>
        <button
          onClick={handleImport}
          disabled={loading}
          className="flex flex-col items-center text-greenery-700 hover:text-greenery-900"
        >
          <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M8 2v4M16 2v4M3 10h18" />
            <circle cx="12" cy="14" r="3" />
          </svg>
          <span className="text-xs font-medium">Import</span>
        </button>
        <button
          onClick={handleScan}
          disabled={loading}
          className="flex flex-col items-center bg-greenery-500 hover:bg-greenery-600 text-white rounded-full px-6 py-2 shadow-lg -mt-8 border-4 border-white"
          style={{ minWidth: 80 }}
        >
          <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M8 2v4M16 2v4M3 10h18" />
          </svg>
          <span className="text-xs font-semibold">Scan</span>
        </button>
        <button
          disabled
          className="flex flex-col items-center text-greenery-300"
        >
          <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
          <span className="text-xs font-medium">History</span>
        </button>
      </div>
    </div>
  );
}
