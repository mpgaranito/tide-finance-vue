export type TxType = "payable" | "receivable";
export type TxStatus = "pending" | "settled";

export interface Transaction {
  id: string;
  type: TxType;
  description: string;
  amount: number;
  dueDate: string; // ISO YYYY-MM-DD
  category: string;
  status: TxStatus;
}

export interface User {
  name: string;
  email: string;
  picture: string;
}

export interface Settings {
  payableAlertDays: number;
  receivableAlertDays: number;
}

const K_USER = "fc.user";
const K_TX = "fc.transactions";
const K_SETTINGS = "fc.settings";
const K_SEEDED = "fc.seeded";

export const DEFAULT_SETTINGS: Settings = {
  payableAlertDays: 5,
  receivableAlertDays: 3,
};

function isBrowser() {
  return typeof window !== "undefined";
}

export const storage = {
  getUser(): User | null {
    if (!isBrowser()) return null;
    const v = localStorage.getItem(K_USER);
    return v ? JSON.parse(v) : null;
  },
  setUser(u: User | null) {
    if (!isBrowser()) return;
    if (u) localStorage.setItem(K_USER, JSON.stringify(u));
    else localStorage.removeItem(K_USER);
  },
  getSettings(): Settings {
    if (!isBrowser()) return DEFAULT_SETTINGS;
    const v = localStorage.getItem(K_SETTINGS);
    return v ? { ...DEFAULT_SETTINGS, ...JSON.parse(v) } : DEFAULT_SETTINGS;
  },
  setSettings(s: Settings) {
    if (!isBrowser()) return;
    localStorage.setItem(K_SETTINGS, JSON.stringify(s));
  },
  getTransactions(): Transaction[] {
    if (!isBrowser()) return [];
    seedIfNeeded();
    const v = localStorage.getItem(K_TX);
    return v ? JSON.parse(v) : [];
  },
  setTransactions(t: Transaction[]) {
    if (!isBrowser()) return;
    localStorage.setItem(K_TX, JSON.stringify(t));
  },
};

function isoOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function seedIfNeeded() {
  if (!isBrowser()) return;
  if (localStorage.getItem(K_SEEDED)) return;
  const seed: Transaction[] = [
    { id: crypto.randomUUID(), type: "payable", description: "Aluguel do escritório", amount: 2800, dueDate: isoOffset(2), category: "Moradia", status: "pending" },
    { id: crypto.randomUUID(), type: "payable", description: "Energia elétrica", amount: 340.75, dueDate: isoOffset(-3), category: "Utilidades", status: "pending" },
    { id: crypto.randomUUID(), type: "payable", description: "Internet fibra", amount: 129.9, dueDate: isoOffset(10), category: "Utilidades", status: "pending" },
    { id: crypto.randomUUID(), type: "payable", description: "Cartão de crédito", amount: 1875.42, dueDate: isoOffset(7), category: "Cartão", status: "pending" },
    { id: crypto.randomUUID(), type: "payable", description: "Assinatura SaaS", amount: 89, dueDate: isoOffset(-10), category: "Software", status: "settled" },
    { id: crypto.randomUUID(), type: "receivable", description: "Cliente Alpha — projeto", amount: 6500, dueDate: isoOffset(1), category: "Serviços", status: "pending" },
    { id: crypto.randomUUID(), type: "receivable", description: "Cliente Beta — mensalidade", amount: 1200, dueDate: isoOffset(-2), category: "Recorrente", status: "pending" },
    { id: crypto.randomUUID(), type: "receivable", description: "Cliente Gamma — consultoria", amount: 3400, dueDate: isoOffset(14), category: "Serviços", status: "pending" },
    { id: crypto.randomUUID(), type: "receivable", description: "Reembolso fornecedor", amount: 210, dueDate: isoOffset(-15), category: "Outros", status: "settled" },
  ];
  localStorage.setItem(K_TX, JSON.stringify(seed));
  localStorage.setItem(K_SEEDED, "1");
}

export function daysUntil(iso: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(iso + "T00:00:00");
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

export function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
}
