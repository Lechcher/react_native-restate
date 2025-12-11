// React hooks for managing state and side effects
import { useCallback, useEffect, useState } from "react";

// React Native Alert component for displaying messages
import { Alert } from "react-native";

// Interface for the options passed to the useAppwrite hook
interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>; // The asynchronous function to execute
  params?: P; // Optional parameters for the function
  skip?: boolean; // If true, the function will not be called on mount
}

// Interface for the return value of the useAppwrite hook
interface UseAppwriteReturn<T, P> {
  data: T | null; // The data returned by the function, or null
  loading: boolean; // Indicates if the data is currently being fetched
  error: string | null; // Any error message, or null
  refetch: (newParams: P) => Promise<void>; // Function to re-run the data fetching
}

// Custom hook to interact with Appwrite functions, managing loading, data, and error states
export const useAppwrite = <T, P extends Record<string, string | number>>({
  fn, // The function to call (e.g., an Appwrite API call)
  params = {} as P, // Default parameters for the function
  skip = false, // Flag to skip initial data fetching
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  // State to store the fetched data
  const [data, setData] = useState<T | null>(null);
  // State to manage the loading status, initialized based on the skip flag
  const [loading, setLoading] = useState(!skip);
  // State to store any error messages
  const [error, setError] = useState<string | null>(null);

  // useCallback to memoize the fetchData function, preventing unnecessary re-renders
  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true); // Set loading to true before fetching
      setError(null); // Clear any previous errors

      try {
        const result = await fn(fetchParams); // Execute the provided function
        setData(result); // Set the fetched data
      } catch (err: unknown) {
        // Catch and handle any errors during fetching
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage); // Set the error message
        Alert.alert("Error", errorMessage); // Display an alert with the error message
      } finally {
        setLoading(false); // Set loading to false after fetching (whether successful or not)
      }
    },
    [fn] // Dependency array: fetchData only changes if fn changes
  );

  // useEffect to call fetchData on component mount, if not skipped
  // biome-ignore lint/correctness/useExhaustiveDependencies: suppress dependency to update only on mount
  useEffect(() => {
    if (!skip) {
      fetchData(params); // Call fetchData with initial parameters
    }
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to refetch data with new parameters
  const refetch = async (newParams: P) => await fetchData(newParams);
  // Ensure refetch has a stable identity to avoid infinite effect loops
  // when used in dependency arrays.
  const stableRefetch = useCallback(
    (newParams: P) => fetchData(newParams),
    [fetchData]
  );

  // Return the data, loading status, error, and stable refetch function
  return { data, loading, error, refetch: stableRefetch };
};
