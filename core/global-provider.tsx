import { createContext, type ReactNode, useContext } from "react";
import { useAppwrite } from "@/hooks/useAppwrite";
import { getCurrentUser } from "./appwrite";

interface User {
	$id: string;
	name: string;
	email: string;
	// biome-ignore lint/suspicious/noExplicitAny: Take object url link image
	avatar: any;
}

interface GlobalContextType {
	isLoggedIn: boolean;
	user: User | null;
	loading: boolean;
	refetch: (newParams: Record<string, string | number>) => Promise<void>;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
	undefined,
);

interface GlobalProviderProps {
	children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
	const {
		data: user,
		loading,
		refetch,
	} = useAppwrite({
		fn: getCurrentUser,
	});

	const isLoggedIn = Boolean(user);

	return (
		<GlobalContext.Provider value={{ isLoggedIn, user, loading, refetch }}>
			{children}
		</GlobalContext.Provider>
	);
};

export const useGlobalContext = (): GlobalContextType => {
	const context = useContext(GlobalContext);

	if (!context)
		throw new Error("useGlobalContext must be used within a GlobalProvider");

	return context;
};

export default GlobalProvider;
