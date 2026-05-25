import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { storage, type Settings, type Transaction, type User, DEFAULT_SETTINGS } from "@/lib/storage";

interface AppCtx {
  user: User | null;
  settings: Settings;
  transactions: Transaction[];
  ready: boolean;
  login: () => Promise<void>;
  logout: () => void;
  updateSettings: (s: Settings) => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  toggleStatus: (id: string) => void;
  deleteTransaction: (id: string) => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { readonly children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(storage.getUser());
    setSettings(storage.getSettings());
    setTransactions(storage.getTransactions());
    setReady(true);
  }, []);

  const login = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 700));
    const fake: User = {
      name: "Alex Pereira",
      email: "alex.pereira@gmail.com",
      picture: "https://api.dicebear.com/9.x/initials/svg?seed=Alex%20Pereira&backgroundType=gradientLinear",
    };
    storage.setUser(fake);
    setUser(fake);
  }, []);

  const logout = useCallback(() => {
    storage.setUser(null);
    setUser(null);
  }, []);

  const updateSettings = useCallback((s: Settings) => {
    storage.setSettings(s);
    setSettings(s);
  }, []);

  const persist = (t: Transaction[]) => {
    storage.setTransactions(t);
    setTransactions(t);
  };

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    persist([{ ...t, id: crypto.randomUUID() }, ...storage.getTransactions()]);
  }, []);

  const toggleStatus = useCallback((id: string) => {
    persist(
      storage.getTransactions().map((t) =>
        t.id === id ? { ...t, status: t.status === "pending" ? "settled" : "pending" } : t,
      ),
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    persist(storage.getTransactions().filter((t) => t.id !== id));
  }, []);

  const value = useMemo<AppCtx>(
    () => ({ user, settings, transactions, ready, login, logout, updateSettings, addTransaction, toggleStatus, deleteTransaction }),
    [user, settings, transactions, ready, login, logout, updateSettings, addTransaction, toggleStatus, deleteTransaction],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be inside AppProvider");
  return v;
}
