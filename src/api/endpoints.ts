export const endpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    register: "/auth/register",
  },
  finance: {
    accounts: "/accounts",
    transactions: "/transactions",
    balance: "/balance",
  },
  users: {
    profile: "/users/profile",
    settings: "/users/settings",
  },
} as const;

export type Endpoints = typeof endpoints;
