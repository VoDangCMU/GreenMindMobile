"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import { useDevSettingsStore } from "@/store/devSettingsStore";
import CatalogueCard from "@/components/dev/CatalogueCard";

interface Props {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function SafeAreaLayout({ children, header, footer, className = '' }: Props) {
  const [showCatalogue, setShowCatalogue] = useState(false);
  const showCatalogueFab = useDevSettingsStore((s) => s.showCatalogueFab);
  const headerRef = useRef<HTMLElement | null>(null);
  const [cardTopOffset, setCardTopOffset] = useState(56);

  useEffect(() => {
    const measure = () => {
      try {
        let h = 0;
        if (headerRef.current) {
          h = Math.round(headerRef.current.getBoundingClientRect().height);
        } else {
          const el = document.querySelector('header.w-full');
          if (el) h = Math.round((el as HTMLElement).getBoundingClientRect().height);
        }
        // clamp to reasonable bounds
        if (!isFinite(h) || h <= 0) h = 56;
        h = Math.min(h, Math.round(window.innerHeight * 0.35));
        setCardTopOffset(Math.min(h + 8, Math.round(window.innerHeight * 0.6)));
      } catch (e) {
        setCardTopOffset(64);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div
      className={`min-h-screen bg-greenery-50 flex flex-col ${className}`}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {header ? (
        <header
          ref={headerRef as any}
          className="w-full relative z-20"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="py-3">
            {header}
          </div>
        </header>
      ) : null}

      {/* Content — bỏ paddingTop để header và nội dung khít nhau */}
      <main className="flex-1 w-full overflow-auto md:pt-10">
        <div>
          {children}
        </div>
      </main>

      {/* Footer: render raw, không thêm padding/margin */}
      {footer ? footer : null}

      {/* Dev Catalogue FAB (global, respects safe-area insets) */}
      {showCatalogueFab && (
        <>
          <button
            aria-label="Open catalogue"
            onClick={() => setShowCatalogue(true)}
            className="fixed z-50"
            style={{ left: `calc(env(safe-area-inset-left, 16px) + 12px)`, top: `calc(env(safe-area-inset-top, 16px) + ${cardTopOffset}px)` }}
          >
            <Button size="icon" className="rounded-full shadow-lg bg-white border border-gray-200 text-greenery-700 hover:bg-gray-50 h-10 w-10 flex items-center justify-center">
              <List className="w-5 h-5" />
            </Button>
          </button>

          {showCatalogue && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowCatalogue(false)} style={{ background: 'transparent' }} />
              <CatalogueCard onClose={() => setShowCatalogue(false)} topOffset={cardTopOffset} />
            </>
          )}
        </>
      )}
    </div>
  );
}
