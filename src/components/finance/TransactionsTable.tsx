import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Trash2, FileDown, Download, Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatIDR, formatTanggal, postAction, type Transaksi } from "@/lib/finance-api";
import { generatePdfReport } from "@/lib/pdf-report"; // Import PDF Utility
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = { rows?: Transaksi[]; loading?: boolean; onChanged: () => void };

export function TransactionsTable({ rows = [], loading, onChanged }: Props) {
  const user = JSON.parse(localStorage.getItem("nexus_user") || "{}");
  const [q, setQ] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // 1. Logic Filter
  const filtered = useMemo(() => {
    if (!Array.isArray(rows)) return [];
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.ID, r.Tanggal, r.Jenis, r.Kategori, r.Metode, r.Deskripsi, String(r.Jumlah)]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s)),
    );
  }, [rows, q]);

  // 2. Logic Pagination
  const totalEntries = filtered?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalEntries / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  const pageRows = filtered.slice(start, start + perPage);

  // 3. Logic Export PDF
  const handleExportPdf = () => {
    if (filtered.length === 0) return toast.error("Tidak ada data untuk diekspor");
    try {
      // Hitung summary sederhana untuk laporan PDF
      let in_ = 0, out = 0;
      filtered.forEach(r => {
        const val = Number(r.Jumlah) || 0;
        if (r.Jenis === "Pemasukan") in_ += val; else out += val;
      });
      generatePdfReport({ 
        rows: filtered, 
        summary: { pemasukan: in_, pengeluaran: out, saldo: in_ - out },
        periodLabel: "Semua Riwayat" 
      });
      toast.success("PDF Berhasil di-generate!");
    } catch { toast.error("Gagal export PDF"); }
  };

  // 4. Logic Export CSV
  const handleExportCsv = () => {
    if (filtered.length === 0) return toast.error("Tidak ada data");
    const headers = ["ID,Tanggal,Jenis,Kategori,Jumlah,Metode,Deskripsi\n"];
    const csvContent = filtered.map(r => 
      `${r.ID},${r.Tanggal},${r.Jenis},${r.Kategori},${r.Jumlah},${r.Metode},${r.Deskripsi}`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Nexus_Finance_Report_${new Date().getTime()}.csv`;
    a.click();
    toast.success("CSV Berhasil didownload!");
  };

  // 5. Handle Delete
  const handleDelete = async () => {
    if (!deleteId || !user.userId) return;
    setDeleting(true);
    try {
      await postAction({ action: "DELETE", id: deleteId, userId: user.userId });
      toast.success("Transaksi dihapus 😆");
      setDeleteId(null);
      onChanged();
    } catch { toast.error("Gagal menghapus"); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-4">
      {/* EXPORT ACTION BUTTONS */}
      <div className="flex flex-wrap gap-2 mb-2">
         <Button onClick={handleExportPdf} variant="outline" className="rounded-xl border-blue-200 bg-blue-50/50 text-blue-600 hover:bg-blue-100 h-10 px-4">
            <FileDown className="w-4 h-4 mr-2" /> PDF
         </Button>
         <Button onClick={handleExportCsv} variant="outline" className="rounded-xl border-green-200 bg-green-50/50 text-green-600 hover:bg-green-100 h-10 px-4">
            <Download className="w-4 h-4 mr-2" /> CSV
         </Button>
      </div>

      <div className="rounded-[30px] bg-card shadow-sm ring-1 ring-border/60 overflow-hidden">
        {/* Search Header */}
        <div className="flex flex-col gap-3 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Tampilkan</span>
            <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
              <SelectTrigger className="h-8 w-[70px] rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[5, 10, 25, 50].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Cari transaksi..."
              className="pl-9 h-11 rounded-2xl bg-muted/20 border-none text-black dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="bg-muted/30 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/60">
                <th className="px-5 py-4">Kategori</th>
                <th className="px-5 py-4 text-center">Tanggal</th>
                <th className="px-5 py-4 text-center">Jenis</th>
                <th className="px-5 py-4 text-right">Jumlah</th>
                <th className="px-5 py-4 text-center">Metode</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-4"><Skeleton className="h-10 w-full rounded-xl" /></td></tr>
                ))
              ) : pageRows.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-24 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-30 italic text-muted-foreground">
                    <Receipt className="w-12 h-12 mb-2" />
                    <p>Belum ada data transaksi... 😆</p>
                  </div>
                </td></tr>
              ) : (
                pageRows.map((t, idx) => (
                  <tr key={t.ID || idx} className="hover:bg-accent/20 transition-colors">
                    <td className="px-5 py-5 font-bold text-foreground">{t.Kategori}</td>
                    <td className="px-5 py-5 text-center text-xs text-muted-foreground">{formatTanggal(t.Tanggal)}</td>
                    <td className="px-5 py-5 text-center">
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-bold border-0 px-2.5 py-1 rounded-full",
                        t.Jenis === "Pemasukan" ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                      )}>
                        {t.Jenis}
                      </Badge>
                    </td>
                    <td className={cn(
                      "px-5 py-5 text-right font-black tabular-nums",
                      t.Jenis === "Pemasukan" ? "text-green-600" : "text-red-600"
                    )}>
                      {formatIDR(Number(t.Jumlah))}
                    </td>
                    <td className="px-5 py-5 text-center text-xs font-semibold text-muted-foreground">{t.Metode}</td>
                    <td className="px-5 py-5 text-right">
                      <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-red-500 hover:bg-red-50" onClick={() => setDeleteId(t.ID)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 p-5 sm:flex-row">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            {totalEntries === 0 ? "0 Entri" : `${start + 1}–${Math.min(start + perPage, totalEntries)} dari ${totalEntries}`}
          </p>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-9 w-9 p-0 rounded-xl" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="bg-muted px-4 py-1.5 rounded-xl text-xs font-black">
              {safePage} / {totalPages}
            </div>
            <Button size="sm" variant="outline" className="h-9 w-9 p-0 rounded-xl" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-[40px] border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-center">Hapus transaksi? 😆</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Data akan hilang permanen dari Google Sheets. Yakin mau hapus, Bro?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-2 sm:justify-center">
            <AlertDialogCancel className="flex-1 rounded-2xl py-6">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="flex-1 rounded-2xl py-6 bg-red-600 text-white hover:bg-red-700">
              {deleting ? "Proses..." : "Ya, Hapus!"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}