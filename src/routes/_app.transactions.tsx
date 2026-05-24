import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Trash2, Search } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatBRL, formatDate, daysUntil } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/transactions")({
  head: () => ({ meta: [{ title: "Fluxo de caixa — Finflow" }] }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const { transactions, toggleStatus, deleteTransaction } = useApp();
  const [type, setType] = useState<"all" | "payable" | "receivable">("all");
  const [status, setStatus] = useState<"all" | "pending" | "settled">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => (type === "all" ? true : t.type === type))
      .filter((t) => (status === "all" ? true : t.status === status))
      .filter((t) => (q ? t.description.toLowerCase().includes(q.toLowerCase()) : true))
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [transactions, type, status, q]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Fluxo de caixa</h1>
          <p className="text-sm text-muted-foreground">Todos os lançamentos do seu negócio.</p>
        </div>
        <Link to="/new" className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 h-10 text-sm font-medium hover:opacity-90">
          Novo lançamento
        </Link>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar descrição..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Segmented
          value={type}
          onChange={(v) => setType(v as typeof type)}
          options={[
            { v: "all", label: "Todos" },
            { v: "receivable", label: "A receber" },
            { v: "payable", label: "A pagar" },
          ]}
        />
        <Segmented
          value={status}
          onChange={(v) => setStatus(v as typeof status)}
          options={[
            { v: "all", label: "Todos status" },
            { v: "pending", label: "Pendentes" },
            { v: "settled", label: "Liquidados" },
          ]}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-medium px-4 py-3">Descrição</th>
                <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">Categoria</th>
                <th className="text-left font-medium px-4 py-3">Vencimento</th>
                <th className="text-right font-medium px-4 py-3">Valor</th>
                <th className="text-center font-medium px-4 py-3">Status</th>
                <th className="px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const isPay = t.type === "payable";
                const d = daysUntil(t.dueDate);
                const overdue = t.status === "pending" && d < 0;
                return (
                  <tr key={t.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", isPay ? "bg-danger" : "bg-success")} />
                        <span className="font-medium">{t.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{t.category}</td>
                    <td className="px-4 py-3">
                      <div>{formatDate(t.dueDate)}</div>
                      {overdue && <div className="text-xs text-danger">Atrasado</div>}
                    </td>
                    <td className={cn("px-4 py-3 text-right font-semibold tabular-nums", isPay ? "text-danger" : "text-success")}>
                      {isPay ? "-" : "+"} {formatBRL(t.amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleStatus(t.id)}
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                          t.status === "settled"
                            ? "bg-success-soft text-success hover:bg-success/20"
                            : "bg-muted text-foreground hover:bg-muted/80",
                        )}
                      >
                        {t.status === "settled" ? (isPay ? "Pago" : "Recebido") : "Pendente"}
                      </button>
                    </td>
                    <td className="px-2 py-3 text-right">
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-2 text-muted-foreground hover:text-danger rounded-md hover:bg-danger-soft"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground text-sm">
                    Nenhum lançamento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Segmented<T extends string>({
  value, onChange, options,
}: { value: T; onChange: (v: T) => void; options: { v: T; label: string }[] }) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={cn(
            "px-3 h-9 text-xs sm:text-sm rounded-md font-medium transition-colors",
            value === o.v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
