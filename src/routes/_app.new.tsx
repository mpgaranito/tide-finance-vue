import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/new")({
  head: () => ({ meta: [{ title: "Novo lançamento — Finflow" }] }),
  component: NewPage,
});

const CATEGORIES = ["Moradia", "Utilidades", "Cartão", "Software", "Serviços", "Recorrente", "Salário", "Outros"];

function NewPage() {
  const { addTransaction } = useApp();
  const navigate = useNavigate();

  const [type, setType] = useState<"payable" | "receivable">("payable");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState("Outros");
  const [status, setStatus] = useState<"pending" | "settled">("pending");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount.replace(",", "."));
    if (!description.trim() || !value || value <= 0) {
      toast.error("Preencha descrição e um valor válido.");
      return;
    }
    addTransaction({ type, description: description.trim(), amount: value, dueDate, category, status });
    toast.success("Lançamento criado com sucesso.");
    navigate({ to: "/transactions" });
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Novo lançamento</h1>
      <p className="text-sm text-muted-foreground mt-1">Cadastre uma conta a pagar ou a receber.</p>

      <form onSubmit={submit} className="mt-8 space-y-6 bg-card border border-border rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-3">
          <TypeButton
            active={type === "receivable"}
            onClick={() => setType("receivable")}
            icon={<ArrowUpCircle className="h-5 w-5" />}
            label="A receber"
            tone="success"
          />
          <TypeButton
            active={type === "payable"}
            onClick={() => setType("payable")}
            icon={<ArrowDownCircle className="h-5 w-5" />}
            label="A pagar"
            tone="danger"
          />
        </div>

        <Field label="Descrição">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex.: Energia elétrica"
            className="form-input"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Valor (R$)">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              inputMode="decimal"
              className="form-input"
            />
          </Field>
          <Field label="Data de vencimento">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-input"
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Categoria">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-input">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="form-input">
              <option value="pending">Pendente</option>
              <option value="settled">{type === "payable" ? "Pago" : "Recebido"}</option>
            </select>
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/transactions" })}
            className="h-10 px-4 rounded-lg border border-border text-sm font-medium hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
          >
            Salvar lançamento
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function TypeButton({
  active, onClick, icon, label, tone,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; tone: "success" | "danger" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 h-12 rounded-lg border text-sm font-medium transition-all",
        active
          ? tone === "success"
            ? "border-success bg-success-soft text-success"
            : "border-danger bg-danger-soft text-danger"
          : "border-border bg-card text-muted-foreground hover:bg-muted",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
