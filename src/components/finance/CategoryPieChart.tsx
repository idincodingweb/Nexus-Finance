import { useMemo } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatIDR, type Transaksi } from "@/lib/finance-api";

const COLORS = [
  "hsl(217 91% 55%)",
  "hsl(0 84% 60%)",
  "hsl(142 71% 45%)",
  "hsl(38 92% 55%)",
  "hsl(280 70% 60%)",
  "hsl(199 89% 48%)",
  "hsl(14 91% 60%)",
  "hsl(160 84% 45%)",
];

export function CategoryPieChart({ rows }: { rows: Transaksi[] }) {
  const data = useMemo(() => {
    const map = new Map<string, number>();
    rows
      .filter((t) => t.Jenis === "Pengeluaran")
      .forEach((t) => {
        const k = t.Kategori || "Lainnya";
        map.set(k, (map.get(k) || 0) + (Number(t.Jumlah) || 0));
      });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [rows]);

  return (
    <div className="rounded-2xl bg-card p-5 shadow-card-soft ring-1 ring-border/60">
      <h3 className="text-base font-semibold text-foreground">Pengeluaran per Kategori</h3>
      <p className="text-xs text-muted-foreground">Distribusi pengeluaran berdasarkan kategori</p>
      <div className="mt-4 h-[280px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Tidak ada data pengeluaran
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--popover-foreground))",
                }}
                formatter={(v: number) => formatIDR(v)}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
