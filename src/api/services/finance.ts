import { apiCall, type ApiResponse } from "../client";
import { endpoints } from "../endpoints";

export interface Account {
  readonly id: string;
  readonly name: string;
  readonly type: "checking" | "savings" | "credit" | "investment";
  readonly balance: number;
  readonly currency: string;
}

export interface Transaction {
  readonly id: string;
  readonly description: string;
  readonly amount: number;
  readonly type: "income" | "expense" | "transfer";
  readonly category: string;
  readonly date: string;
  readonly status: "pending" | "settled";
}

export interface BalanceResponse {
  readonly total: number;
  readonly accounts: Account[];
  readonly currency: string;
}

export const financeService = {
  getAccounts: (): Promise<ApiResponse<Account[]>> =>
    apiCall<Account[]>(endpoints.finance.accounts, { method: "GET" }),

  getTransactions: (accountId?: string): Promise<ApiResponse<Transaction[]>> =>
    apiCall<Transaction[]>(
      accountId ? `${endpoints.finance.transactions}?accountId=${accountId}` : endpoints.finance.transactions,
      { method: "GET" }
    ),

  addTransaction: (payload: Omit<Transaction, "id">): Promise<ApiResponse<Transaction>> =>
    apiCall<Transaction>(endpoints.finance.transactions, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateTransaction: (id: string, payload: Partial<Transaction>): Promise<ApiResponse<Transaction>> =>
    apiCall<Transaction>(`${endpoints.finance.transactions}/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteTransaction: (id: string): Promise<ApiResponse<void>> =>
    apiCall<void>(`${endpoints.finance.transactions}/${id}`, { method: "DELETE" }),

  getBalance: (): Promise<ApiResponse<BalanceResponse>> =>
    apiCall<BalanceResponse>(endpoints.finance.balance, { method: "GET" }),
};
