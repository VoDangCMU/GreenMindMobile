import AppHeader from "@/components/AppHeader";
import AppHeaderButton from "@/components/AppHeaderButton";
import { Search, Loader2, Check } from "lucide-react";
import InvoiceDetailModal from "@/components/InvoiceDetailModal";
import { useEffect, useState } from "react";
import HistoryPageFooter from "@/components/HistoryPageFooter";
import useBillStore from "@/store/invoiceStore";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import invoiceApi from "@/apis/invoice";
import { useAppStore } from "@/store/appStore";
import InvoiceList from "@/components/InvoiceList";

export default function InvoiceHistoryPage() {
  const invoices = useBillStore((state) => state.invoices);
  const isOcring = useBillStore((state) => state.isOcring);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const appState = useAppStore.getState();

   
  useEffect(() => {
    invoiceApi.getInvoicesByUserId(appState.user?.id!).then((data) => {
      console.log("Fetched invoices:", data);
      useBillStore.getState().setInvoices(data ? data : []);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaLayout
      header={
        <AppHeader
          title="Scanned Bills"
          showBack
          rightActions={[
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
