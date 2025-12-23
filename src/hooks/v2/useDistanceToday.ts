import { useCallback, useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { getDistanceToday, type IGetDistanceTodayResponseData } from "@/apis/backend/v2/location";

type Options = {
  enabled?: boolean;
  intervalMs?: number | null;
};

export default function useDistanceToday(options: Options = {}) {
  const { enabled = true, intervalMs = null } = options;
  const { call, loading } = useFetch();

  const [data, setData] = useState<IGetDistanceTodayResponseData | null>(null);
  const [error, setError] = useState<unknown | null>(null);

  const intervalRef = useRef<number | null>(null);

  const fetchDistance = useCallback(async () => {
    try {
      const result = (await call({ fn: () => getDistanceToday() })) as {
        data: { message: string; data: IGetDistanceTodayResponseData } | null;
        error: unknown | null;
      };

      if (result?.data && result.data.data) {
        setData(result.data.data);
        setError(null);
        return result.data.data;
      }

      setData(null);
      return null;
    } catch (err) {
      setError(err);
      return null;
    }
  }, [call]);

  useEffect(() => {
    if (!enabled) return;

    void fetchDistance();

    if (intervalMs && intervalMs > 0) {
      const id = window.setInterval(() => void fetchDistance(), intervalMs) as unknown as number;
      intervalRef.current = id;
      return () => {
        clearInterval(id);
        intervalRef.current = null;
      };
    }

    return undefined;
  }, [enabled, intervalMs, fetchDistance]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const startPolling = useCallback((ms: number = 30000) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const id = window.setInterval(() => void fetchDistance(), ms) as unknown as number;
    intervalRef.current = id;
  }, [fetchDistance]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return {
    data,
    error,
    loading,
    refresh: fetchDistance,
    startPolling,
    stopPolling,
  } as const;
}
