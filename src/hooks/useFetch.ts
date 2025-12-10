import { useState, useCallback, useRef } from "react";

type CallItem<T = any> = {
  fn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onFailed?: (error: unknown) => void;
  onFinally?: () => void;
};

export default function useFetch() {
  const [loading, setLoading] = useState(false);
  const active = useRef(0);

  const start = () => {
    active.current++;
    setLoading(true);
  };

  const end = () => {
    active.current--;
    if (active.current === 0) {
      setLoading(false);
    }
  };

  const call = useCallback(
    async (input: CallItem | CallItem[]) => {
      if (Array.isArray(input)) {
        start();
        try {
          const tasks = input.map(async (item) => {
            try {
              const res = await item.fn();
              item.onSuccess?.(res);
              return { data: res, error: null };
            } catch (err) {
              item.onFailed?.(err);
              return { data: null, error: err };
            } finally {
              item.onFinally?.();
            }
          });

          return await Promise.all(tasks);
        } finally {
          end();
        }
      }

      try {
        start();
        const res = await input.fn();
        input.onSuccess?.(res);
        return { data: res, error: null };
      } catch (err) {
        input.onFailed?.(err);
        return { data: null, error: err };
      } finally {
        input.onFinally?.();
        end();
      }
    },
    []
  );

  return { call, loading };
}
