import AppHeader from "@/components/common/AppHeader";
import AppHeaderButton from "@/components/common/AppHeaderButton";
import { Search, Loader2, Check, RefreshCw } from "lucide-react";
import InvoiceDetailModal from "@/components/app-components/InvoiceDetailModal";
import { useEffect, useState } from "react";
import HistoryPageFooter from "@/components/app-components/HistoryPageFooter";
import useBillStore from "@/store/invoiceStore";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import invoiceApi from "@/apis/backend/invoice";

import InvoiceList from "@/components/app-components/InvoiceList";
import { usePreAppSurveyStore } from "@/store/preAppSurveyStore";
import { useDailySpending } from "@/hooks/metric/useDailySpending";
import useFetch from "@/hooks/useFetch";

export default function InvoiceHistoryPage() {
  const invoices = useBillStore((state) => state.invoices);
  const isOcring = useBillStore((state) => state.isOcring);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const preAppSurveyAnswers = usePreAppSurveyStore((state) => state.answers);
  const { call } = useFetch();

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
