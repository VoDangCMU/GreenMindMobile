import AppHeader from "@/components/common/AppHeader";
import AppHeaderButton from "@/components/common/AppHeaderButton";
import { Search, Loader2, Check, RefreshCw } from "lucide-react";
import InvoiceDetailModal from "@/components/app-components/InvoiceDetailModal";
import { useEffect, useState } from "react";
import HistoryPageFooter from "@/components/app-components/HistoryPageFooter";
import useBillStore from "@/store/invoiceStore";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import invoiceApi from "@/apis/backend/invoice";
import { useAppStore } from "@/store/appStore";
import InvoiceList from "@/components/app-components/InvoiceList";
import { avg_daily_spend } from "@/apis/ai/monitor_ocean";
import type { IAvgDailySpend } from "@/apis/ai/monitor_ocean";
import { usePreAppSurveyStore } from "@/store/preAppSurveyStore";
import { useAuthStore } from "@/store/authStore";

export default function InvoiceHistoryPage() {
  const invoices = useBillStore((state) => state.invoices);
  const isOcring = useBillStore((state) => state.isOcring);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isUpdatingOcean, setIsUpdatingOcean] = useState(false);
  const user = useAuthStore((s) => s.user);
  const setOcean = useAppStore((state) => state.setOcean);
  const ocean = useAppStore((state) => state.ocean);
  const preAppSurveyAnswers = usePreAppSurveyStore((state) => state.answers);

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
      return parseFloat(latestInvoice.grandTotal);
    }
    return 0;
  };

  // Manual OCEAN update from invoice data
  const handleUpdateOcean = async () => {
    setIsUpdatingOcean(true);
    const daily_total = getLatestInvoiceTotal();
    const base_avg = getBaseAvg();
    
    if (!ocean) {
      setIsUpdatingOcean(false);
      return; // No OCEAN scores, skip silently
    }

    if (daily_total === 0) {
      setIsUpdatingOcean(false);
      return; // No invoices, skip silently
    }

    const data: IAvgDailySpend = {
      daily_total,
      base_avg,
      weight: 0.2,
      direction: "down",
      sigma_r: 1.0,
      alpha: 0.5,
      ocean_score: {
        O: ocean.O / 100, // Convert back to 0-1 range
        C: ocean.C / 100,
        E: ocean.E / 100,
        A: ocean.A / 100,
        N: ocean.N / 100,
      },
    };
    
    try {
      const res = await avg_daily_spend(data);
      if (res && res.new_ocean_score) {
        setOcean(res.new_ocean_score);
        console.log(`OCEAN updated from invoice! Daily: ${daily_total}, Base: ${base_avg}`);
      }
    } catch (error) {
      console.warn("Failed to update OCEAN from invoice:", error);
    } finally {
      setIsUpdatingOcean(false);
    }
  };

   
  useEffect(() => {
    invoiceApi.getInvoicesByUserId(user?.id!).then((data) => {
      console.log("Fetched invoices:", data);
      useBillStore.getState().setInvoices(data ? data : []);
    });
  }, []);

  return (
    <SafeAreaLayout
      header={
        <AppHeader
          title="Scanned Bills"
          showBack
          rightActions={[
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
          ]}
        />
      }
      footer={<HistoryPageFooter />}
    >
      <div className="flex flex-col bg-gradient-to-br">
        <div className="flex-1 w-full mx-auto px-3 pb-28">
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
