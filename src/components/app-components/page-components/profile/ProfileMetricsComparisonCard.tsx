"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { usePreAppSurveyStore } from "@/store/preAppSurveyStore";
import useInvoiceStore from "@/store/invoiceStore";
import usePlantScanStore from "@/store/plantScanStore";
import { useNightOutHistoryStore } from "@/store/nightOutHistoryStore";
import { getDistanceToday } from "@/apis/backend/v2/location";
import invoiceApi from "@/apis/backend/v1/invoice";
import useFetch from "@/hooks/useFetch";

interface MetricRowProps {
    label: string;
    surveyValue: string | number;
    actualValue: string | number;
    unit?: string;
}

function MetricRow({ label, surveyValue, actualValue, unit }: MetricRowProps) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{label}</p>
                <p className="text-xs text-gray-500">Goal: {surveyValue} {unit}</p>
            </div>
            <div className="text-right">
                <p className={`text-sm font-bold ${typeof actualValue === 'number' && typeof surveyValue === 'number' && actualValue >= surveyValue ? 'text-green-600' : 'text-blue-600'}`}>
                    {actualValue} <span className="text-xs font-normal text-gray-500">{unit}</span>
                </p>
            </div>
        </div>
    );
}

export default function ProfileMetricsComparisonCard() {
    const answers = usePreAppSurveyStore((s) => s.answers);
    const invoices = useInvoiceStore((s) => s.invoices);
    const setInvoices = useInvoiceStore((s) => s.setInvoices);
    const plantScans = usePlantScanStore((s) => s.scans);
    const { getNightOutRecords } = useNightOutHistoryStore();
    const { call } = useFetch();

    const [actualDistance, setActualDistance] = useState<number>(0);

    // Fetch invoices on mount to ensure data availability
    useEffect(() => {
        if (invoices.length === 0) {
            call({
                fn: () => invoiceApi.getInvoices(),
                onSuccess: (data: any) => {
                    setInvoices(data || []);
                },
            });
        }
    }, []); // Only run once on mount

    // 1. Calculate Actual Spending (Today)
    // Use local time for "today"
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    const actualSpending = (invoices || [])
        .filter(inv => {
            // Helper to match logic in MetricsPage
            const normalizeDate = (d: string | undefined) => {
                if (!d) return '';
                if (d.includes('/')) {
                    const [day, month, year] = d.split('/');
                    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                }
                return d;
            };
            let invDate = normalizeDate(inv.datetime?.date);
            // Fallback to createdAt if datetime is missing, converting ISO to YYYY-MM-DD
            if (!invDate && inv.createdAt) {
                try {
                    const created = new Date(inv.createdAt);
                    const cYear = created.getFullYear();
                    const cMonth = String(created.getMonth() + 1).padStart(2, '0');
                    const cDay = String(created.getDate()).padStart(2, '0');
                    invDate = `${cYear}-${cMonth}-${cDay}`;
                } catch (e) { }
            }
            return invDate === today;
        })
        .reduce((sum, inv) => sum + (parseFloat(inv.totals?.grand_total || '0') || 0), 0);

    // 2. Calculate Actual Night Out (Last 7 Days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);
    const last7DaysStr = last7Days.toISOString().split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];
    const nightOutRecords = getNightOutRecords(last7DaysStr, todayStr);
    // Count unique dates
    const actualNightOut = new Set(nightOutRecords.map(r => r.date)).size;

    // 3. Calculate Actual Healthy Food (Ratio > 30%)
    const totalScans = plantScans.length;
    const healthyScans = plantScans.filter(s => (s.vegetable_ratio_percent ?? 0) > 30).length;
    const actualHealthyRatio = totalScans > 0 ? Math.round((healthyScans / totalScans) * 100) : 0;

    // 4. Distance
    useEffect(() => {
        getDistanceToday().then(res => {
            if (res?.data?.total_distance) {
                setActualDistance(res.data.total_distance);
            }
        }).catch(err => console.error(err));
    }, []);

    return (
        <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <span>Metrics Comparison</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                <MetricRow
                    label="Avg Daily Spend"
                    surveyValue={new Intl.NumberFormat('vi-VN').format(Number(answers?.avg_daily_spend || 0))}
                    actualValue={new Intl.NumberFormat('vi-VN').format(actualSpending)}
                    unit="VND"
                />
                <MetricRow
                    label="Daily Distance"
                    surveyValue={answers?.daily_distance_km || 0}
                    actualValue={actualDistance.toFixed(2)}
                    unit="km"
                />
                <MetricRow
                    label="Night Out (7 days)"
                    surveyValue={answers?.night_out_freq || 0}
                    actualValue={actualNightOut}
                    unit="times"
                />
                <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Healthy Food</p>
                        <p className="text-xs text-gray-500">Goal: Level {answers?.healthy_food_ratio || 0} (1-5)</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-blue-600">
                            {actualHealthyRatio}% <span className="text-xs font-normal text-gray-500">healthy</span>
                        </p>
                    </div>
                </div>

                {/* Placeholders for others as requested (0 if not available) */}
                <MetricRow label="Spend Variability" surveyValue={answers?.spend_variability || 0} actualValue={0} unit="(1-5)" />
                <MetricRow label="List Adherence" surveyValue={answers?.list_adherence || 0} actualValue={0} unit="(1-5)" />

            </CardContent>
        </Card>
    );
}
