"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function CatalogueCard({ onClose, topOffset = 48 }: { onClose?: () => void; topOffset?: number }) {
  const routes = [
    { path: '/', label: 'Login' },
    { path: '/register', label: 'Register' },
    { path: '/onboarding', label: 'Onboarding' },
    { path: '/onboarding-quiz', label: 'Onboarding Quiz' },
    { path: '/home', label: 'Home' },
    { path: '/checkins', label: 'Checkins' },
    { path: '/profile', label: 'Profile' },
    { path: '/metrics', label: 'Metrics' },
    { path: '/survey-list', label: 'Surveys' },
    { path: '/plant-scan', label: 'Plant Scan' },
    { path: '/invoice-history', label: 'Invoice History' },
    { path: '/todo', label: 'Todo' },
    { path: '/dev-settings', label: 'Dev Settings' },
    { path: '/debug/quiz', label: 'Debug Quiz' },
    { path: '/notifications', label: 'Notifications' }
  ];

  return (
    <div style={{ position: 'fixed', left: `calc(env(safe-area-inset-left, 16px) + 12px)`, top: `calc(env(safe-area-inset-top, 16px) + ${topOffset}px)`, zIndex: 50, maxHeight: `calc(100vh - ${topOffset}px - 12px)`, boxSizing: 'border-box', overflow: 'auto' }}>
      <Card className="w-80 shadow-lg h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Catalogue</CardTitle>
            <div className="flex items-center gap-2">
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close catalogue">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          <CardDescription>Quick links to the app pages</CardDescription>
        </CardHeader>
        <CardContent style={{ maxHeight: `calc(100vh - ${topOffset + 96}px)`, overflow: 'auto' }}>
          <div className="grid gap-2">
            {routes.map((r) => (
              <div key={r.path} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Link to={r.path} className="text-sm font-medium text-foreground hover:underline">{r.label}</Link>
                  <span className="text-xs text-muted-foreground">{r.path}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(r.path);
                      toast.success("Copied path");
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
