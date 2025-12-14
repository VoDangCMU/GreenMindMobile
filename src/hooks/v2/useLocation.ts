import type { GetLattestLocationResponse, IGetDistanceTodayResponse } from "@/apis/backend/v2/location";
import { useState } from "react";
import useFetch from "../useFetch";

export default function useLocation() {
    // Latest Location
    const [latestlocation, setLatestLocation] = useState<GetLattestLocationResponse | null>(null);
    const { call } = useFetch();
    const updateLatestLocation = () => {
        return call({
            fn: () => import("@/apis/backend/v2/location").then((mod) => mod.getLatestLocation()),
            onSuccess: (data) => {
                setLatestLocation(data);
            },
        });
    };

    // Today Distance
    const [todayDistance, setTodayDistance] = useState<IGetDistanceTodayResponse | null>(null);
    const updateTodayDistance = () => {
        call({
            fn: () => import("@/apis/backend/v2/location").then((mod) => mod.getDistanceToday()),
            onSuccess: (data) => {
                setTodayDistance(data);
            }
        });
    }
    return {
        latestlocation,
        updateLatestLocation,
        todayDistance,
        updateTodayDistance,
    };
}