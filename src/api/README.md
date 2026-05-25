# API Structure Guide

## 📁 Estrutura de Pastas

```
src/
├── api/
│   ├── client.ts              # Cliente HTTP central
│   ├── endpoints.ts           # Definição de endpoints
│   ├── index.ts               # Exportações centralizadas
│   └── services/
│       ├── auth.ts            # Serviço de autenticação
│       ├── finance.ts         # Serviço de finanças
│       └── users.ts           # Serviço de usuários
└── hooks/
    └── use-api.ts             # Hook customizado para requisições
```

## 🚀 Como Usar

### 1. **Fazer uma requisição simples**

```typescript
import { authService } from "@/api";

// Em um componente
const { data, loading, error } = useApi(
  () => authService.login({ email: "user@example.com", password: "pass" })
);
```

### 2. **Usar um serviço no contexto**

```typescript
import { financeService } from "@/api";

export function AppProvider({ children }: { readonly children: React.ReactNode }) {
  const [transactions, setTransactions] = React.useState([]);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      const result = await financeService.getTransactions();
      if (result.success && result.data) {
        setTransactions(result.data);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <Ctx.Provider value={{ transactions }}>
      {children}
    </Ctx.Provider>
  );
}
```

### 3. **Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📌 Serviços Disponíveis

### Authentication (`authService`)
- `login(payload)` - Fazer login
- `logout()` - Fazer logout
- `register(payload)` - Criar conta

### Finance (`financeService`)
- `getAccounts()` - Listar contas
- `getTransactions(accountId?)` - Listar transações
- `addTransaction(payload)` - Adicionar transação
- `updateTransaction(id, payload)` - Atualizar transação
- `deleteTransaction(id)` - Deletar transação
- `getBalance()` - Obter saldo

### Users (`usersService`)
- `getProfile()` - Obter perfil
- `updateProfile(payload)` - Atualizar perfil
- `getSettings()` - Obter configurações
- `updateSettings(payload)` - Atualizar configurações

## 🔧 Adicionar Novo Serviço

1. Crie um novo arquivo em `src/api/services/novo-servico.ts`
2. Use o padrão do `authService` como template
3. Exporte em `src/api/index.ts`
4. Importe onde precisar!
