import AppHeader from "@/components/common/AppHeader";
import AppHeaderButton from "@/components/common/AppHeaderButton";
import { Search, Loader2, Check, RefreshCw, Lightbulb } from "lucide-react";
import InvoiceDetailModal from "@/components/app-components/page-components/invoice-history/InvoiceDetailModal";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useToast } from '@/hooks/useToast';
import ocrInvoice from '@/apis/backend/v1/ai-forward/image-processing/ocr-invoice';
import PageActionFooter from "@/components/common/PageActionFooter";
import useBillStore from "@/store/invoiceStore";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import invoiceApi from "@/apis/backend/v1/invoice";

import InvoiceList from "@/components/app-components/page-components/invoice-history/InvoiceList";
import { usePreAppSurveyStore } from "@/store/preAppSurveyStore";
import { useDailySpending } from "@/hooks/metric/useDailySpending";
import useFetch from "@/hooks/useFetch";
import { useMetricFeedbackStore } from "@/store/v2/metricFeedbackStore";
import { MetricFeedbackCard } from "./MetricsPage";

export default function InvoiceHistoryPage() {
  const invoices = useBillStore((state) => state.invoices);
  const isOcring = useBillStore((state) => state.isOcring);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const preAppSurveyAnswers = usePreAppSurveyStore((state) => state.answers);
  const { call } = useFetch();
  const spendingFeedback = useMetricFeedbackStore((s) => s.getFeedback("avg_daily_spend"));
  const navigate = useNavigate();
  const location = useLocation();
  const addInvoice = useBillStore((state) => state.addInvoice);
  const setOcring = useBillStore((state) => state.setOcring);
  const toast = useToast();

  // Scan handler (can be triggered from footer or auto-start)
  const handleScan = async () => {
    setOcring(true);
    let photo;
    try {
      photo = await Camera.getPhoto({
        quality: 60,
        width: 1024,
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
      exportedInvoice = await ocrInvoice(photo)
    } catch (err) {
      console.log("OCR error:", err);
      toast.error("OCR error");
      setOcring(false);
      return;
    }

    addInvoice(exportedInvoice);
    setOcring(false);
    toast.success("Invoice added successfully");
  };

  const handleImport = async () => {
    let photo;
    try {
      photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        saveToGallery: false,
        allowEditing: false,
      });
    } catch (err) {
      console.log("Camera error:", err);
      toast.error("Camera error");
      setOcring(false);
      return;
    }

    setOcring(true);

    const exportedInvoice = await ocrInvoice(photo)
    if (!exportedInvoice) {
      console.error("No bill data returned from OCR.");
      setOcring(false);
      return;
    }

    addInvoice(exportedInvoice);
    setOcring(false);
    toast.success("Invoice added successfully");
  };

  // If page was opened with state.startScan, trigger scan on mount
  useEffect(() => {
    if ((location as any)?.state?.startScan) {
      handleScan();
      // clear state to avoid re-trigger on navigation back
      navigate(location.pathname, { replace: true });
    }
  }, []);


  // Get base_avg from preAppSurvey avg_daily_spend
  const getBaseAvg = () => {
    if (preAppSurveyAnswers?.avg_daily_spend) {
      return parseInt(preAppSurveyAnswers.avg_daily_spend);
    }
    return 500000; // default
  };

  // Calculate daily total from latest invoice
  const getLatestInvoiceTotal = () => {
    if (invoices.length > 0) {
      const latestInvoice = invoices[0]; // assuming sorted by newest first
      return parseFloat(latestInvoice.totals.grand_total);
    }
    return 0;
  };

  // Manual OCEAN update from invoice data
  const { callDailySpending, loading: isUpdatingOcean } = useDailySpending();

  const handleUpdateOcean = async () => {
    const daily_total = getLatestInvoiceTotal();
    const base_avg = getBaseAvg();

    if (daily_total === 0) {
      return; // No invoices, skip silently
    }

    try {
      await callDailySpending(daily_total, base_avg);
      console.log(`OCEAN updated from invoice! Daily: ${daily_total}, Base: ${base_avg}`);
    } catch (error) {
      console.warn("Failed to update OCEAN from invoice:", error);
    }
  };


  useEffect(() => {
    call({
      fn: () => invoiceApi.getInvoices(),
      onSuccess: (data: IInvoice[]) => {
        console.log("Fetched invoices:", data);
        useBillStore.getState().setInvoices(data ? data : []);
      },
      onFailed: (error: any) => {
        console.error("Failed to fetch invoices:", error);
      },
    })
  }, []);

  return (
    <SafeAreaLayout
      header={
        <AppHeader
          title="Scanned Bills"
          showBack
          rightActions={[
            spendingFeedback ? (
              <AppHeaderButton
                key="feedback"
                icon={<Lightbulb className="w-5 h-5 text-yellow-500" />}
                onClick={() => setShowFeedback(!showFeedback)}
              />
            ) : null,
            <AppHeaderButton
              key="update-ocean"
              icon={
                isUpdatingOcean ? (
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                ) : (
                  <RefreshCw className="h-6 w-6 text-blue-500" />
                )
              }
              onClick={handleUpdateOcean}
            />,
            <AppHeaderButton key="bell" icon={<Search />} />,
            <AppHeaderButton key="settings" icon={isOcring ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : <Check className="h-6 w-6 text-green-500" />} />,
          ].filter(Boolean)}
        />
      }
      footer={<PageActionFooter onScan={handleScan} onImport={handleImport} />}
    >
      <div className="flex flex-col bg-gradient-to-br">
        <div className="flex-1 w-full mx-auto px-3 pb-28">
          {/* Show feedback card if available */}
          {showFeedback && spendingFeedback && (
            <div className="mb-4">
              <MetricFeedbackCard feedback={spendingFeedback} />
            </div>
          )}

          <InvoiceList
            invoices={invoices}
            onInvoiceClick={(invoice) => {
              setSelectedBill(invoice);
              setShowModal(true);
            }}
          />
        </div>
      </div>
      <InvoiceDetailModal invoice={selectedBill} open={showModal} onClose={() => setShowModal(false)} />
    </SafeAreaLayout>
  );
}
