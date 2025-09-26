import { Card } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  Package,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import type React from "react";

interface MetricsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function MetricsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: MetricsCardProps) {
  return (
    <Card className="p-4 bg-background/50 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-muted-foreground">{title}</h3>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              {trend.isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              <span
                className={`text-sm ${
                  trend.isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
