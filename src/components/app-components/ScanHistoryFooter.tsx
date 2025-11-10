import React from "react";
import { ScanLine } from "lucide-react";


interface ScanHistoryFooterProps {
  onScan: () => void;
  scanIcon?: React.ReactNode;
  importLabel?: string;
  onImport?: (() => void) | null;
  importIcon?: React.ReactNode;
}

const ScanHistoryFooter: React.FC<ScanHistoryFooterProps> = ({
  onScan,
  scanIcon = <ScanLine className="w-9 h-9" />,
  importLabel = "Import",
  onImport = null,
  importIcon,
}) => {
  return (
    <div
      className="fixed bottom-0 left-0 w-full bg-white/90 border-t border-greenery-100 flex justify-between items-center px-8 py-3 md:justify-center md:gap-40"
      style={{ boxShadow: "0 -2px 16px 0 rgba(0,0,0,0.04)" }}
    >
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
      {/* Scan button (centered absolutely, no text, bigger, lower) */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-12">
        <button
          onClick={onScan}
          className="flex items-center justify-center bg-greenery-500 hover:bg-greenery-600 text-white rounded-full w-20 h-20 shadow-2xl border-4 border-white transition active:scale-95"
        >
          {scanIcon}
        </button>
      </div>
      {/* Import button (optional) */}
      {onImport && (
        <button
          onClick={onImport}
          className="flex flex-col items-center text-greenery-700 hover:text-greenery-900"
        >
          {importIcon || (
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
          )}
          <span className="text-xs font-medium">{importLabel}</span>
        </button>
      )}
    </div>
  );
};

export default ScanHistoryFooter;
