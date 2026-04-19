import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatIDR, type Summary } from "@/lib/finance-api";
import { cn } from "@/lib/utils";

type Props = { summary?: Summary; loading?: boolean };

const cards = [
  {
    key: "pemasukan" as const,
    title: "Total Pemasukan",
    icon: ArrowUpCircle,
    accent: "from-emerald-500 to-green-600",
    soft: "bg-success-soft text-success",
    ring: "ring-success/20",
  },
  {
    key: "pengeluaran" as const,
    title: "Total Pengeluaran",
    icon: ArrowDownCircle,
    accent: "from-rose-500 to-red-600",
    soft: "bg-danger-soft text-danger",
    ring: "ring-danger/20",
  },
  {
    key: "saldo" as const,
    title: "Sisa Saldo",
    icon: Wallet,
    accent: "from-blue-500 to-sky-600",
    soft: "bg-accent text-primary",
    ring: "ring-primary/20",
  },
];

export function SummaryCards({ summary, loading }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.key}
            className={cn(
              "group relative overflow-hidden rounded-2xl bg-card p-5 shadow-card-soft ring-1",
              c.ring,
            )}
          >
            <div
              className={cn(
                "absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-10 transition-opacity group-hover:opacity-20",
                c.accent,
              )}
            />
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-muted-foreground">{c.title}</p>
                {loading || !summary ? (
                  <Skeleton className="h-8 w-40" />
                ) : (
                  <p className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {formatIDR(summary[c.key])}
                  </p>
                )}
              </div>
              <div className={cn("rounded-xl p-2.5", c.soft)}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
