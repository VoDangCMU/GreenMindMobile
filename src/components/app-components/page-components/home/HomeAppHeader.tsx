// ...existing code...
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/app-components/page-components/login/Logo";

// No scroll-to-hide logic; header is always visible

export default function HomeAppHeader() {
  return (
    <header
      className="w-full flex items-center justify-between px-4 py-3 bg-greenery-50 shadow-sm fixed top-0 left-0 z-30"
      style={{ paddingTop: 'env(safe-area-inset-top, 16px)' }}
    >
      <div className="flex items-center gap-2">
        <Logo size={32} />
        <span className="text-xl font-bold text-greenery-700">GreenMind</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="w-6 h-6 text-greenery-700" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="w-6 h-6 text-greenery-700" />
        </Button>
      </div>
    </header>
  );
}

// Add a helper to export the header height for use in pages
export const APP_HEADER_HEIGHT = 64 + (typeof window !== 'undefined' && window.CSS && CSS.supports('top: env(safe-area-inset-top)') ? 0 : 16);
