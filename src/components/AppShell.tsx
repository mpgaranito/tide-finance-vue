import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Receipt, Settings as SettingsIcon, LogOut, Wallet, PlusCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Fluxo de caixa", icon: Receipt },
  { to: "/new", label: "Novo lançamento", icon: PlusCircle },
  { to: "/settings", label: "Configurações", icon: SettingsIcon },
] as const;

export function AppShell({ children }: { readonly children: React.ReactNode }) {
  const { user, logout } = useApp();
  const loc = useLocation();
  const nav2 = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    nav2({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur px-4 h-14">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <Wallet className="h-5 w-5 text-primary" /> Finflow
        </Link>
        <button onClick={() => setOpen((v) => !v)} className="p-2 rounded-md hover:bg-muted">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <div className="lg:flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:flex lg:flex-col lg:border-r lg:border-border lg:bg-card",
            open ? "block" : "hidden lg:block",
            "bg-card border-b lg:border-b-0 border-border",
          )}
        >
          <div className="hidden lg:flex items-center gap-2 px-6 h-16 border-b border-border">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Finflow</span>
          </div>

          <nav className="p-3 space-y-1 flex-1">
            {nav.map((n) => {
              const Icon = n.icon;
              const active = loc.pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-3 px-2 py-2">
              <img src={user?.picture} alt="" className="h-9 w-9 rounded-full bg-muted" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Sair"
                className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
