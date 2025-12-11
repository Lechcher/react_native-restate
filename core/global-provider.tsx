// Imports for React hooks and context management
import { createContext, type ReactNode, useContext } from "react";
// Custom hook for Appwrite integration
import { useAppwrite } from "@/hooks/useAppwrite";
// Function to get the current user from Appwrite
import { getCurrentUser } from "./appwrite";

// Interface defining the structure of a User object
interface User {
  $id: string; // Unique ID of the user
  name: string; // User's name
  email: string; // User's email address
  // biome-ignore lint/suspicious/noExplicitAny: Avatar can be any type of image link
  avatar: any; // User's avatar, can be any image link type
}

// Interface defining the shape of the Global Context
interface GlobalContextType {
  isLoggedIn: boolean; // Indicates if the user is logged in
  user: User | null; // The current user object or null if not logged in
  loading: boolean; // Indicates if user data is currently being loaded
  refetch: (newParams: Record<string, string | number>) => Promise<void>; // Function to refetch user data
}

// Create the Global Context with an initial undefined value
export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

// Interface for the props of the GlobalProvider component
interface GlobalProviderProps {
  children: ReactNode; // React nodes to be rendered within the provider
}

// GlobalProvider component to manage and provide global state to its children
export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  // Use the useAppwrite hook to fetch current user data
  const {
    data: user, // User data returned from useAppwrite
    loading, // Loading state from useAppwrite
    refetch, // Refetch function from useAppwrite
  } = useAppwrite({
    fn: getCurrentUser, // Function to execute for fetching data
  });

  // Determine if the user is logged in based on the presence of a user object
  const isLoggedIn = Boolean(user);

  return (
    // Provide the global context values to all children components
    <GlobalContext.Provider value={{ isLoggedIn, user, loading, refetch }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to easily consume the Global Context
export const useGlobalContext = (): GlobalContextType => {
  // Get the context value
  const context = useContext(GlobalContext);

  // Throw an error if the hook is used outside of a GlobalProvider
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context; // Return the context value
};

// Export GlobalProvider as the default export
export default GlobalProvider;
