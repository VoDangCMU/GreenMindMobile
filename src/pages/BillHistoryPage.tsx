import AppHeader from "@/components/AppHeader";
import AppHeaderButton from "@/components/AppHeaderButton";
import { Settings, Search, Loader2, Check } from "lucide-react";
import BillList from "@/components/BillList";
import BillDetailModal from "@/components/BillDetailModal";
import { useState } from "react";
import HistoryPageFooter from "@/components/HistoryPageFooter";
import useBillStore from "@/store/billStore";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";

export default function BillHistoryPage() {
  const bills = useBillStore((state) => state.bills);
  const isOcring = useBillStore((state) => state.isOcring);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
          <BillList
            bills={bills}
            onBillClick={(bill) => {
              setSelectedBill(bill);
              setShowModal(true);
            }}
          />
        </div>
      </div>
      <BillDetailModal bill={selectedBill} open={showModal} onClose={() => setShowModal(false)} />
    </SafeAreaLayout>
  );
}
