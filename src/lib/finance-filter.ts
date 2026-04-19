import type { Transaksi, Summary } from "./finance-api";

export type DatePreset = "all" | "this_month" | "last_month" | "custom";

export type FilterState = {
  preset: DatePreset;
  from?: Date;
  to?: Date;
};

export function getPresetRange(preset: DatePreset): { from?: Date; to?: Date } {
  const now = new Date();
  if (preset === "this_month") {
    // Awal bulan ini sampai akhir bulan ini
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { from, to };
  }
  if (preset === "last_month") {
    // Awal bulan lalu sampai akhir bulan lalu
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return { from, to };
  }
  return {};
}

export function applyFilter(rows: any[], filter: FilterState): any[] {
  if (!Array.isArray(rows)) return [];
  
  const { from, to } =
    filter.preset === "custom" ? { from: filter.from, to: filter.to } : getPresetRange(filter.preset);
  
  // Kalau pilih 'Semua', gak usah di-filter
  if (filter.preset === "all") return rows;

  return rows.filter((t) => {
    // Handle property Tanggal / tanggal (Case Insensitive)
    const valTanggal = t.Tanggal || t.tanggal;
    if (!valTanggal) return false;

    const d = new Date(valTanggal);
    if (isNaN(d.getTime())) return false;

    if (from && d < from) return false;
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      if (d > end) return false;
    }
    return true;
  });
}

export function computeSummary(rows: any[]): Summary {
  let p = 0;
  let k = 0;
  
  if (!Array.isArray(rows)) return { pemasukan: 0, pengeluaran: 0, saldo: 0 };

  rows.forEach((t) => {
    // JEBRED! Handle Jumlah / jumlah & Jenis / jenis (Biar aman dari typo kapital)
    const jumlah = Number(t.Jumlah || t.jumlah) || 0;
    const jenis = t.Jenis || t.jenis;

    if (jenis === "Pemasukan") p += jumlah;
    else if (jenis === "Pengeluaran") k += jumlah;
  });
  
  return { pemasukan: p, pengeluaran: k, saldo: p - k };
}

export function filterLabel(filter: FilterState): string {
  if (filter.preset === "all") return "Semua Waktu";
  if (filter.preset === "this_month") return "Bulan Ini";
  if (filter.preset === "last_month") return "Bulan Lalu";
  
  const fmt = (d?: Date) =>
    d ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}` : "—";
  
  return `${fmt(filter.from)} - ${fmt(filter.to)}`;
}