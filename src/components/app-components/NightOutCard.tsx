// src/components/NightActivityCard.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Moon } from "lucide-react";

const COLORS = ["#3b82f6", "#9ca3af"]; // blue - night out, gray - night in

export default function NightOutCard() {
  // Giả lập dữ liệu 7 ngày gần nhất
  const last7Days = [
    { date: "2025-11-06", wentOut: true },
    { date: "2025-11-07", wentOut: false },
    { date: "2025-11-08", wentOut: true },
    { date: "2025-11-09", wentOut: false },
    { date: "2025-11-10", wentOut: false },
    { date: "2025-11-11", wentOut: true },
    { date: "2025-11-12", wentOut: false },
  ];

  const outCount = last7Days.filter((d) => d.wentOut).length;
  const inCount = last7Days.length - outCount;

  const chartData = [
    { name: "Night Out", value: outCount },
    { name: "Night In", value: inCount },
  ];

  return (
    <Card className="mb-6 border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center space-x-2">
          <Moon className="w-4 h-4 text-indigo-500" />
          <span>Night Activity (7 days)</span>
        </CardTitle>
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
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Mô tả bên phải */}
        <div className="w-1/2 space-y-2">
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
        </div>
      </CardContent>
    </Card>
  );
}
