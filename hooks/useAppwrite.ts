import { useCallback, useEffect, useState } from "react";

import { Alert } from "react-native";

interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams: P) => Promise<void>;
}

export const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fn(fetchParams);
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppress dependency to update only on mount
  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
  }, []);

  const refetch = async (newParams: P) => await fetchData(newParams);
  // Ensure refetch has a stable identity to avoid infinite effect loops
  // when used in dependency arrays.
  const stableRefetch = useCallback((newParams: P) => fetchData(newParams), [fetchData]);

  return { data, loading, error, refetch: stableRefetch };
};
