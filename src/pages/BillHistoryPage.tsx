import AppHeader from "@/components/AppHeader";
import AppHeaderButton from "@/components/AppHeaderButton";
import { Settings, Search } from "lucide-react";
import BillCard from "@/components/BillCard";
import HistoryPageFooter from "@/components/HistoryPageFooter";
import useBillStore from "@/store/billStore";

export default function BillHistoryPage() {
  const bills = useBillStore((state) => state.bills);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-greenery-50 to-greenery-100">
      {/* Header tái sử dụng */}
      <AppHeader
        title="Scanned Bills"
        showBack
        rightActions={[
          <AppHeaderButton key="bell" icon={<Search />} />,
          <AppHeaderButton key="settings" icon={<Settings />} />,
        ]}
      />

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
              <BillCard bill={bill} />
            ))}
          </ul>
        )}
      </div>
      <HistoryPageFooter />
    </div>
  );
}
