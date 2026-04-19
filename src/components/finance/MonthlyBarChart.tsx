import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatIDR, type Transaksi } from "@/lib/finance-api";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export function MonthlyBarChart({ rows }: { rows: Transaksi[] }) {
  const data = useMemo(() => {
    const map = new Map<string, { key: string; label: string; pemasukan: number; pengeluaran: number }>();
    rows.forEach((t) => {
      const d = new Date(t.Tanggal);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
      if (!map.has(key)) map.set(key, { key, label, pemasukan: 0, pengeluaran: 0 });
      const j = Number(t.Jumlah) || 0;
      const cur = map.get(key)!;
      if (t.Jenis === "Pemasukan") cur.pemasukan += j;
      else if (t.Jenis === "Pengeluaran") cur.pengeluaran += j;
    });
    return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key)).slice(-6);
  }, [rows]);

  return (
    <div className="rounded-2xl bg-card p-5 shadow-card-soft ring-1 ring-border/60">
      <h3 className="text-base font-semibold text-foreground">Pemasukan vs Pengeluaran</h3>
      <p className="text-xs text-muted-foreground">Perbandingan bulanan (6 bulan terakhir)</p>
      <div className="mt-4 h-[280px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Tidak ada data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickFormatter={(v) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}jt` : v >= 1000 ? `${v / 1000}rb` : v)}
              />
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
              <Bar dataKey="pemasukan" fill="hsl(142 71% 45%)" radius={[6, 6, 0, 0]} name="Pemasukan" />
              <Bar dataKey="pengeluaran" fill="hsl(0 84% 60%)" radius={[6, 6, 0, 0]} name="Pengeluaran" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
