import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Save } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Configurações — Finflow" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, updateSettings, user } = useApp();
  const [payable, setPayable] = useState(settings.payableAlertDays);
  const [receivable, setReceivable] = useState(settings.receivableAlertDays);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ payableAlertDays: payable, receivableAlertDays: receivable });
    toast.success("Preferências de alerta atualizadas.");
  };

  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personalize quando os alertas devem aparecer no dashboard.
        </p>
      </header>

      <section className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="h-9 w-9 rounded-lg bg-warning-soft text-warning flex items-center justify-center">
            <Bell className="h-5 w-5" />
          </span>
          <h2 className="text-lg font-semibold">Alertas de vencimento</h2>
        </div>
        <p className="text-sm text-muted-foreground ml-12">
          Contas dentro da janela definida — ou já atrasadas — aparecerão na central de alertas.
        </p>

        <form onSubmit={save} className="mt-6 space-y-5">
          <SliderField
            label="Avisar contas a pagar"
            value={payable}
            onChange={setPayable}
            help={`${payable} dia${payable === 1 ? "" : "s"} de antecedência`}
          />
          <SliderField
            label="Avisar recebimentos"
            value={receivable}
            onChange={setReceivable}
            help={`${receivable} dia${receivable === 1 ? "" : "s"} de antecedência`}
          />

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
            >
              <Save className="h-4 w-4" /> Salvar preferências
            </button>
          </div>
        </form>
      </section>

      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Conta</h2>
        <div className="flex items-center gap-4">
          <img src={user?.picture} alt="" className="h-12 w-12 rounded-full bg-muted" />
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SliderField({
  label, value, onChange, help,
}: { label: string; value: number; onChange: (v: number) => void; help: string }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs text-muted-foreground">{help}</span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={30}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-primary"
        />
        <input
          type="number"
          min={0}
          max={60}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="form-input w-20 text-center"
        />
      </div>
    </div>
  );
}
