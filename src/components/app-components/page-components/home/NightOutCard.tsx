// src/components/NightActivityCard.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Moon, RefreshCw } from "lucide-react";
import { useNightOutHistoryStore } from "@/store/nightOutHistoryStore";
import { useAppStore } from "@/store/appStore";
import { useMemo } from "react";

import { useNightOutFeq } from "@/hooks/metric/useNightOutFeq";
import { usePreAppSurveyStore } from "@/store/preAppSurveyStore";

const COLORS = ["#3b82f6", "#9ca3af"]; // blue - night out, gray - night in

export default function NightOutCard() {
  // Subscribe to records so component re-renders when they change
  const { getNightOutRecords, records } = useNightOutHistoryStore();
  const { callNightOutFeq, loading } = useNightOutFeq();
  const ocean = useAppStore((state) => state.ocean);
  const preAppSurvey = usePreAppSurveyStore((state) => state.answers);


  // Tính toán dữ liệu 7 ngày gần nhất
  const last7Days = useMemo(() => {
    const today = new Date();
    const daysArray = [];

    // Tạo mảng 7 ngày gần nhất
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      daysArray.push(dateString);
    }

    // Lấy records từ store
    const startDate = daysArray[0];
    const endDate = daysArray[daysArray.length - 1];
    const nightOutRecords = getNightOutRecords(startDate, endDate);

    // Tạo map để check ngày nào có night out
    const nightOutDates = new Set(nightOutRecords.map(record => record.date));

    return daysArray.map(date => ({
      date,
      wentOut: nightOutDates.has(date)
    }));
  }, [getNightOutRecords, records]);

  // Function to update OCEAN based on night out frequency
  const updateOceanWithNightOut = async () => {
    // Get night out count for the last 7 days
    const currentWeekCount = last7Days.filter(d => d.wentOut).length;

    // Get baseline night out frequency from pre-app survey
    const baseNightOut = preAppSurvey?.night_out_freq
      ? parseInt(preAppSurvey.night_out_freq)
      : 2; // Fallback to 2 if no pre-app data

    await callNightOutFeq(currentWeekCount, baseNightOut);
  };

  const outCount = last7Days.filter((d) => d.wentOut).length;
  const inCount = last7Days.length - outCount;
  const hasAnyData = outCount > 0; // Check if there's any night out activity

  const chartData = hasAnyData
    ? [
      { name: "Night Out", value: outCount },
      { name: "Night In", value: inCount },
    ]
    : [
      { name: "Chưa có dữ liệu", value: 7 }, // Show all 7 days as "no data"
    ];

  return (
    <Card className="mb-6 border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center space-x-2">
            <Moon className="w-4 h-4 text-indigo-500" />
            <span>Night Activity (7 days)</span>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                const fakeDate = new Date();
                // Randomly subtract 0-6 days to populate the chart
                fakeDate.setDate(fakeDate.getDate() - Math.floor(Math.random() * 6));
                useNightOutHistoryStore.getState().addNightOutRecord({
                  timestamp: fakeDate.toISOString(),
                  distanceFromHome: 0.5,
                  location: { latitude: 0, longitude: 0 }
                });
                // Force re-render if needed or rely on store subscription? 
                // Store subscription might not auto-trigger 'last7Days' memo if it depends on 'getNightOutRecords' which is a function.
                // Actually 'getNightOutRecords' is stable, but the result of calling it changes. 
                // We need to trigger a re-render. Since we use 'getNightOutRecords' in useMemo, 
                // we might need to depend on 'records' directly or force update.
                // Let's rely on standard Zustand reactivity if properly used.
                // Wait, usage: `const { getNightOutRecords } = useNightOutHistoryStore();` 
                // This selector selects actions/functions. It DOES NOT subscribe to state changes if we only select functions!
                // We must select state to trigger updates.
              }}
              size="sm"
              variant="ghost"
              className="text-xs text-gray-500 hover:text-indigo-600"
            >
              Simulate
            </Button>
            <Button
              onClick={updateOceanWithNightOut}
              disabled={loading || !ocean}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-xs">Update OCEAN</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex items-center gap-4">
        {/* Biểu đồ tròn bên trái */}
        <div className="w-1/2 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
              // label={({ name }) => name}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={hasAnyData ? COLORS[index % COLORS.length] : "#e5e7eb"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Mô tả bên phải */}
        <div className="w-1/2 space-y-2">
          {hasAnyData ? (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">
                  Night Out: {outCount} ngày
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-sm font-medium">
                  Night In: {inCount} ngày
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Dữ liệu thống kê trong 7 ngày gần nhất
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <span className="text-sm font-medium text-gray-500">
                  Chưa có dữ liệu night out
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Dữ liệu sẽ được ghi nhận khi bạn ra ngoài vào ban đêm (18:00-06:00) và cách nhà &gt;100m
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
