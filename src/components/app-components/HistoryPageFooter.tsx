import React from "react";
import { ScanLine } from "lucide-react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import useInvoiceStore from "@/store/invoiceStore";
import ocrBill from "@/apis/ai/ocrInvoice";
import invoiceApi from "@/apis/backend/invoice";
import { toast } from "sonner";
import ocrInvoice from "@/apis/backend/ai-forward/ocr-invoice";

interface HistoryPageFooterProps {
  onImport?: () => void;
  onScan?: () => void;
  loading?: boolean;
}

const HistoryPageFooter: React.FC<HistoryPageFooterProps> = () => {
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  const setOcring = useInvoiceStore((state) => state.setOcring);
  const addAIInvoice = useInvoiceStore((state) => state.addAIInvoice);
  const invoices = useInvoiceStore((state) => state.invoices);

  const handleScan = async () => {
    setOcring(true);
    let photo;
    try {
      photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        saveToGallery: false,
        allowEditing: false,
      });
    } catch (err) {
      console.log("Camera error:", err);
      toast.error("Camera error");
      setOcring(false);
      return;
    }

    let exportedInvoice;
    try {
      // exportedInvoice = await ocrBill(photo);
      exportedInvoice = await ocrInvoice(photo)
    } catch (err) {
      console.log("OCR error:", err);
      toast.error("OCR error");
      setOcring(false);
      return;
    }

    if (exportedInvoice) {
      let createdInvoice;
      try {
        createdInvoice = await invoiceApi.createInvoice(exportedInvoice);

        console.log("Created invoice from server:", createdInvoice);

        addInvoice(createdInvoice);
        setOcring(false);
        toast.success("Invoice added successfully");

        console.log("Local states:", invoices);

        return;
      } catch (err) {
        console.log("Cannot use server, saving locally:", err);
        toast.warning("Cannot use server, saving locally");
        addAIInvoice(exportedInvoice);

        setOcring(false);
        return;
      }
    } else {
      toast.error("No invoice data returned from OCR.");
      setOcring(false);
      return;
    }
  };

  const handleImport = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        saveToGallery: false,
        allowEditing: false,
      });

      setOcring(true);

      // const exportedInvoice = await ocrBill(photo);
      const exportedInvoice = await ocrInvoice(photo)
      if (!exportedInvoice) {
        console.error("No bill data returned from OCR.");
        return;
      }

      try {
        const createdInvoice = await invoiceApi.createInvoice(exportedInvoice);
        addInvoice(createdInvoice);
      } catch (error) {
        console.error("Failed to create invoice:", error);
        addAIInvoice(exportedInvoice);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
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
          onClick={handleScan}
          className="flex items-center justify-center \
                     bg-greenery-500 hover:bg-greenery-600 text-white rounded-full \
                     w-20 h-20 shadow-2xl border-4 border-white transition active:scale-95"
        >
          <ScanLine className="w-9 h-9" />
        </button>
      </div>
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
    </div>
  );
};

export default HistoryPageFooter;
