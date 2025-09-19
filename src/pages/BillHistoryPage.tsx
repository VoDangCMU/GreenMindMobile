import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { Bell, Settings, ScanLine } from "lucide-react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
// import { Geolocation } from "@capacitor/geolocation";
import { Filesystem } from "@capacitor/filesystem";
import axios from "axios";

let mockBills = [
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
      {
        raw_name: "Coca",
        brand: "Coca",
        quantity: 2,
        unit_price: 25000,
        line_total: 50000,
      },
      {
        raw_name: "Spnte",
        brand: "Sprite",
        quantity: 2,
        unit_price: 25000,
        line_total: 50000,
      },
      {
        raw_name: "Touc",
        brand: "Touc",
        quantity: 2,
        unit_price: 25000,
        line_total: 50000,
      },
      {
        raw_name: "Soda",
        brand: "Soda",
        quantity: 1,
        unit_price: 25000,
        line_total: 25000,
      },
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

export default function BillHistoryPage() {
  const [bills, setBills] = useState(mockBills);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mở camera hệ thống
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera, // 👈 ép mở camera
        saveToGallery: false,
        allowEditing: false,
      });

      console.log("Ảnh chụp:", JSON.stringify(photo));

      if (!photo.path && !photo.webPath) {
        throw new Error("Không có đường dẫn ảnh");
      }

      let file: File;

      // Native iOS/Android + Web
      if (photo.webPath) {
        const response = await fetch(photo.webPath); // photo.webPath vẫn tồn tại trên Native
        const blob = await response.blob();
        file = new File([blob], "scan.jpg", {
          type: blob.type || "image/jpeg",
        });
      }

      // let file: File;

      // if (photo.path) {
      //   // Native Android/iOS
      //   const fileData = await Filesystem.readFile({ path: photo.path });
      //   if (!fileData.data) throw new Error("Không đọc được file");

      //   // base64 → byte array
      //   const byteString = atob(fileData.data);
      //   const byteArray = new Uint8Array(byteString.length);
      //   for (let i = 0; i < byteString.length; i++) {
      //     byteArray[i] = byteString.charCodeAt(i);
      //   }

      //   const blob = new Blob([byteArray], { type: "image/jpeg" });
      //   file = new File([blob], "scan.jpg", { type: "image/jpeg" });
      // } else if (photo.webPath) {
      //   // fallback web
      //   const response = await fetch(photo.webPath);
      //   const blob = await response.blob();
      //   file = new File([blob], "scan.jpg", {
      //     type: blob.type || "image/jpeg",
      //   });
      // } else {
      //   throw new Error("Không có đường dẫn ảnh");
      // }

      console.log("đã xử lí xong file ảnh");
      console.log("File ảnh:", file);

      const formData = new FormData();
      formData.append("file", file);

      console.log("Đang gửi lên server OCR...");

      axios
        .post("https://ai-greenmind.khoav4.com/ocr_text", formData)
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          mockBills = [data];
          console.log("Kết quả OCR:", JSON.stringify(mockBills[0]));
        })
        .catch((error) => {
          console.error("Lỗi OCR:", JSON.stringify(error));
        });
    } catch (err: any) {
      setError(err.message || "Camera error");
    } finally {
      setLoading(false);
    }
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
      {/* Header tái sử dụng */}
      <AppHeader
        title="Scanned Bills"
        showBack
        rightActions={[
          <button
            key="bell"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Bell className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>,
          <button
            key="settings"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>,
        ]}
      />

      {/* Bill List */}
      <div className="flex-1 w-full mx-auto px-3 pb-28">
        {bills.length === 0 ? (
          <div className="text-center text-gray-400 mt-16">
            No bills scanned yet.
          </div>
        ) : (
          <ul
            className="
        grid gap-4 mt-2
        grid-cols-1
        sm:grid-cols-1
        lg:grid-cols-1
      "
          >
            {bills.map((bill) => (
              <li
                key={bill.id}
                className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-greenery-100"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-greenery-700">
                      {bill.vendor.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {bill.vendor.address}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {bill.datetime.date} {bill.datetime.time}
                  </div>
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
                    <span className="text-xs text-gray-400">
                      +{bill.items.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="font-bold text-greenery-700">
                    {bill.totals.grand_total.toLocaleString()}{" "}
                    {bill.doc.currency}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
      </div>

      {/* Footer responsive */}
      <div
        className="fixed bottom-0 left-0 w-full bg-white/90 border-t border-greenery-100 
                   flex justify-between items-center px-8 py-3 md:justify-center md:gap-40"
        style={{ boxShadow: "0 -2px 16px 0 rgba(0,0,0,0.04)" }}
      >
        {/* Import button */}
        <button
          onClick={handleImport}
          disabled={loading}
          className="flex flex-col items-center text-greenery-700 hover:text-greenery-900"
        >
          <svg
            className="w-7 h-7 mb-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M8 2v4M16 2v4M3 10h18" />
            <circle cx="12" cy="14" r="3" />
          </svg>
          <span className="text-xs font-medium">Import</span>
        </button>

        {/* Scan button (centered absolutely, no text, bigger, lower) */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-12">
          <button
            onClick={handleScan}
            disabled={loading}
            className="flex items-center justify-center 
                       bg-greenery-500 hover:bg-greenery-600 text-white rounded-full 
                       w-20 h-20 shadow-2xl border-4 border-white transition active:scale-95"
          >
            <ScanLine className="w-9 h-9" />
          </button>
        </div>

        {/* History button */}
        <button
          disabled
          className="flex flex-col items-center text-greenery-300"
        >
          <svg
            className="w-7 h-7 mb-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
          <span className="text-xs font-medium">History</span>
        </button>
      </div>
    </div>
  );
}
