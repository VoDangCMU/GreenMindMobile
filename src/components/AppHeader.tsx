import { useEffect, useRef, useState } from "react";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  const [visible, setVisible] = useState(true);
  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastScroll.current && y > 40) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScroll.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`w-full flex items-center justify-between px-4 py-3 bg-greenery-50 shadow-sm fixed top-0 left-0 z-30 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}
      style={{ paddingTop: 'env(safe-area-inset-top, 16px)' }}
    >
      <span className="text-xl font-bold text-greenery-700">GreenMind</span>
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
