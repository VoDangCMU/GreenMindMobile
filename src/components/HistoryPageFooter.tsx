import React from "react";
import { ScanLine } from "lucide-react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import axios from "axios";
import { Filesystem } from "@capacitor/filesystem";
import useBillStore from "@/store/billStore";
import ocrBill from "@/apis/ocrBill";

interface HistoryPageFooterProps {
  onImport?: () => void;
  onScan?: () => void;
  loading?: boolean;
}

const HistoryPageFooter: React.FC<HistoryPageFooterProps> = () => {
  const addBill = useBillStore((state) => state.addBill);
  const setOcring = useBillStore((state) => state.setOcring);

  const handleImport = async () => {};

  const handleScan = async () => {
    setOcring(true);
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        saveToGallery: false,
        allowEditing: false,
      });

      const exportedBill = await ocrBill(photo);
      if (exportedBill) {
        addBill(exportedBill);
      } else {
        console.error("No bill data returned from OCR.");
      }
    } catch (err: any) {
      console.error("Upload error:", JSON.stringify(err));
    } finally {
      setOcring(false);
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 w-full bg-white/90 border-t border-greenery-100 \
                   flex justify-between items-center px-8 py-3 md:justify-center md:gap-40"
      style={{ boxShadow: "0 -2px 16px 0 rgba(0,0,0,0.04)" }}
    >
      {/* Import button */}
      <button
        onClick={handleImport}
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
          className="flex items-center justify-center \
                     bg-greenery-500 hover:bg-greenery-600 text-white rounded-full \
                     w-20 h-20 shadow-2xl border-4 border-white transition active:scale-95"
        >
          <ScanLine className="w-9 h-9" />
        </button>
      </div>

      {/* History button */}
      <button disabled className="flex flex-col items-center text-greenery-300">
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
  );
};

export default HistoryPageFooter;
