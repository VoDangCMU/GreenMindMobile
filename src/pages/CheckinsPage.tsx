"use client";

import { useEffect, useState } from "react";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/common/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCheckins } from "@/apis/backend/v2/checkin";
import { toast } from "sonner";
import { Bus, Trees, MapPin, Coffee, ShoppingBag, Book, Dumbbell, Home } from "lucide-react";

interface ICheckinItem {
  id: string;
  latitude: string;
  longitude: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

function getIconForLocation(location: string | undefined) {
  // Normalize and guard
  if (!location) return <MapPin className="w-5 h-5 text-greenery-600" />;
  const l = location.toLowerCase().trim();
  // Use word boundaries where appropriate to reduce false matches
  if (/\b(bus|station)\b/.test(l)) return <Bus className="w-5 h-5 text-greenery-600" />;
  if (/\bpark\b/.test(l)) return <Trees className="w-5 h-5 text-greenery-600" />;
  if (/\b(restaurant|diner|eatery)\b/.test(l)) return <MapPin className="w-5 h-5 text-greenery-600" />;
  if (/\b(cafe|coffee)\b/.test(l)) return <Coffee className="w-5 h-5 text-greenery-600" />;
  if (/\b(mall|market|shop|shopping)\b/.test(l)) return <ShoppingBag className="w-5 h-5 text-greenery-600" />;
  if (/\b(museum|library|book)\b/.test(l)) return <Book className="w-5 h-5 text-greenery-600" />;
  if (/\b(gym|fitness|dumbbell)\b/.test(l)) return <Dumbbell className="w-5 h-5 text-greenery-600" />;
  if (/\b(school)\b/.test(l)) return <Home className="w-5 h-5 text-greenery-600" />;
  // default fallback: MapPin
  return <MapPin className="w-5 h-5 text-greenery-600" />;
}

export default function CheckinsPage() {
  const [items, setItems] = useState<ICheckinItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCheckins();
      setItems(res?.data?.checkins?.slice().reverse() ?? []);
    } catch (err) {
      console.error("Failed to load checkins", err);
      toast.error("Failed to load check-ins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    const onCreated = (e: any) => {
      const ch = e?.detail;
      if (!ch || !ch.id) return;
      const newItem: ICheckinItem = {
        id: ch.id,
        latitude: typeof ch.latitude === 'number' ? ch.latitude.toFixed(7) : String(ch.latitude ?? ''),
        longitude: typeof ch.longitude === 'number' ? ch.longitude.toFixed(7) : String(ch.longitude ?? ''),
        location: ch.location ?? '',
        createdAt: ch.createdAt ?? new Date().toISOString(),
        updatedAt: ch.updatedAt ?? new Date().toISOString(),
      };
      setItems((prev) => [newItem, ...prev.filter((p) => p.id !== newItem.id)]);
    };

    window.addEventListener('checkin:created', onCreated as EventListener);
    return () => window.removeEventListener('checkin:created', onCreated as EventListener);
  }, []);

  return (
    <SafeAreaLayout header={<AppHeader showBack title="Check-ins" />}>
      <div className="max-w-sm mx-auto p-4 space-y-4">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Your Check-ins</CardTitle>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={load} className="h-9">Refresh</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {items.length === 0 && !loading ? (
              <div className="text-gray-500 text-center py-8">No check-ins yet</div>
            ) : (
              <div className="space-y-2">
                {items.map((it) => (
                  <div key={it.id} className="p-3 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-greenery-50">
                      {getIconForLocation(it.location)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{it.location}</div>
                      <div className="text-xs text-gray-500">{new Date(it.createdAt).toLocaleString()} — {parseFloat(it.latitude).toFixed(6)}, {parseFloat(it.longitude).toFixed(6)}</div>
                    </div>
                    <div>
                      <Button size="sm" variant="outline" onClick={() => navigator.clipboard?.writeText(`${it.latitude},${it.longitude}`)}>Copy</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SafeAreaLayout>
  );
}
