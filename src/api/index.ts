// Exportar todos os serviços de um único ponto
export { apiCall, type ApiResponse } from "./client";
export { endpoints, type Endpoints } from "./endpoints";
export { authService, type AuthResponse, type LoginPayload, type RegisterPayload } from "./services/auth";
export { financeService, type Account, type Transaction, type BalanceResponse } from "./services/finance";
export { usersService, type UserProfile, type UserSettings } from "./services/users";
