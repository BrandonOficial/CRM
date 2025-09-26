import { Button } from "@/components/ui/button";
import { MetricsCard } from "@/components/metrics-card";
import { InventoryTable } from "@/components/inventory-table";
import {
  ChevronDown,
  Package,
  AlertTriangle,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid lg:grid-cols-[160px_1fr]">
        <aside className="border-r bg-background/50 backdrop-blur">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Package className="h-6 w-6" />
            <span className="font-bold">StockManager</span>
          </div>
        </aside>
        <main className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Dashboard de Estoque</h1>
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("pt-BR")}
              </div>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              Relatório Mensal
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <MetricsCard
              title="Total de Itens"
              value="5"
              subtitle="Produtos cadastrados"
            />
            <MetricsCard
              title="Itens em Baixa"
              value="2"
              subtitle="Precisam de reposição"
              icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
              trend={{
                value: "Atenção necessária",
                isPositive: false,
              }}
            />
            <MetricsCard
              title="Valor Total"
              value="R$ 4.194,80"
              subtitle="Inventário atual"
              icon={<DollarSign className="h-4 w-4 text-green-500" />}
              trend={{
                value: "+5.2% vs mês anterior",
                isPositive: true,
              }}
            />
            <MetricsCard
              title="Taxa de Rotatividade"
              value="78%"
              subtitle="Itens movimentados"
              icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
              trend={{
                value: "+12% vs mês anterior",
                isPositive: true,
              }}
            />
          </div>
          <div className="mt-6">
            <InventoryTable />
          </div>
        </main>
      </div>
    </div>
  );
}
