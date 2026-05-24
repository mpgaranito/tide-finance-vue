import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownCircle, ArrowUpCircle, Wallet, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { daysUntil, formatBRL, formatDate, type Transaction } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Finflow" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { transactions, settings, user, toggleStatus } = useApp();

  const pending = transactions.filter((t) => t.status === "pending");
  const totalReceivable = pending.filter((t) => t.type === "receivable").reduce((s, t) => s + t.amount, 0);
  const totalPayable = pending.filter((t) => t.type === "payable").reduce((s, t) => s + t.amount, 0);
  const balance = totalReceivable - totalPayable;

  const alerts = pending
    .map((t) => ({ tx: t, days: daysUntil(t.dueDate) }))
    .filter(({ tx, days }) => {
      const window = tx.type === "payable" ? settings.payableAlertDays : settings.receivableAlertDays;
      return days <= window;
    })
    .sort((a, b) => a.days - b.days);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Olá, {user?.name.split(" ")[0]}</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Visão geral</h1>
        </div>
        <Link
          to="/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 h-10 text-sm font-medium hover:opacity-90"
        >
          Novo lançamento
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          icon={<ArrowUpCircle className="h-5 w-5" />}
          label="Total a receber"
          value={formatBRL(totalReceivable)}
          tone="success"
        />
        <SummaryCard
          icon={<ArrowDownCircle className="h-5 w-5" />}
          label="Total a pagar"
          value={formatBRL(totalPayable)}
          tone="danger"
        />
        <SummaryCard
          icon={<Wallet className="h-5 w-5" />}
          label="Saldo previsto"
          value={formatBRL(balance)}
          tone={balance >= 0 ? "success" : "danger"}
        />
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Central de alertas
          </h2>
          <Link to="/settings" className="text-xs text-muted-foreground hover:text-foreground">
            Configurar janelas
          </Link>
        </div>

        {alerts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <CheckCircle2 className="h-8 w-8 mx-auto text-success" />
            <p className="mt-2 text-sm text-muted-foreground">
              Nada na janela de alerta. Tudo sob controle.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {alerts.map(({ tx, days }) => (
              <AlertCard key={tx.id} tx={tx} days={days} onToggle={() => toggleStatus(tx.id)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryCard({
  icon, label, value, tone,
}: { icon: React.ReactNode; label: string; value: string; tone: "success" | "danger" | "neutral" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span
          className={cn(
            "h-9 w-9 rounded-lg flex items-center justify-center",
            tone === "success" && "bg-success-soft text-success",
            tone === "danger" && "bg-danger-soft text-danger",
            tone === "neutral" && "bg-muted text-foreground",
          )}
        >
          {icon}
        </span>
      </div>
      <p className={cn(
        "mt-3 text-2xl font-semibold tracking-tight",
        tone === "success" && "text-success",
        tone === "danger" && "text-danger",
      )}>
        {value}
      </p>
    </div>
  );
}

function AlertCard({ tx, days, onToggle }: { tx: Transaction; days: number; onToggle: () => void }) {
  const overdue = days < 0;
  const isPayable = tx.type === "payable";
  return (
    <div
      className={cn(
        "rounded-xl border p-4 bg-card",
        overdue ? "border-danger/40 bg-danger-soft/40" : "border-warning/40 bg-warning-soft/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
              isPayable ? "bg-danger/10 text-danger" : "bg-success/10 text-success",
            )}>
              {isPayable ? "A pagar" : "A receber"}
            </span>
            <span className="text-muted-foreground">{tx.category}</span>
          </div>
          <p className="mt-1.5 font-medium truncate">{tx.description}</p>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {overdue
              ? `Atrasado há ${Math.abs(days)} dia${Math.abs(days) === 1 ? "" : "s"}`
              : days === 0
              ? "Vence hoje"
              : `Vence em ${days} dia${days === 1 ? "" : "s"}`}
            {" · "}
            {formatDate(tx.dueDate)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className={cn("font-semibold", isPayable ? "text-danger" : "text-success")}>
            {formatBRL(tx.amount)}
          </p>
          <button
            onClick={onToggle}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
          >
            Marcar como {isPayable ? "pago" : "recebido"}
          </button>
        </div>
      </div>
    </div>
  );
}
