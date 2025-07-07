"use-client";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import RefreshToken from "./refresh-token";
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // disable refetch on window focus
      refetchOnMount: false, // disable refetch on mount
    },
  },
});

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRoleState] = useState<RoleType | undefined>();
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const role = decodeToken(accessToken).role;
      setRoleState(role);
    }
  }, []);
  // cac ban dung react 19 va next 15 khong can dung useCallback cung duoc
  const setRole = useCallback((role?: RoleType | undefined) => {
    if (role) {
      setRoleState(role);
    } else {
      removeTokensFromLocalStorage();
    }
  }, []);

  const isAuth = Boolean(role);
  // neu dung react 19 next 15 khong can dung AppContext.Provider
  // chi can dung AppContext
  return (
    <AppContext.Provider value={{ role, setRole, isAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <button onClick={() => setIsOpen(!isOpen)}>{`${
          isOpen ? "Close" : "Open"
        } the devtools panel`}</button>
        {isOpen && <ReactQueryDevtoolsPanel onClose={() => setIsOpen(false)} />}
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
