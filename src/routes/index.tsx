import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user, ready } = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    if (!ready) return;
    navigate({ to: user ? "/dashboard" : "/login", replace: true });
  }, [ready, user, navigate]);
  return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Carregando...</div>;
}
