import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatIDR, type Transaksi } from "@/lib/finance-api";

// Nama prop gua ganti jadi 'rows' biar sinkron sama pemanggilan di Transactions.tsx
type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  rows?: Transaksi[]; // Kasih tanda tanya (optional)
};

export function DetailDialog({ open, onOpenChange, rows = [] }: Props) {
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();

  // 1. Filter Logic dengan Safety Check
  const filtered = useMemo(() => {
    // JEBRED! Jaga-jaga kalau data belum ada
    if (!Array.isArray(rows)) return [];
    
    return rows.filter((t) => {
      const d = new Date(t.Tanggal);
      if (isNaN(d.getTime())) return false;
      if (from && d < from) return false;
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        if (d > end) return false;
      }
      return true;
    });
  }, [rows, from, to]);

  // 2. Summary Logic
  const summary = useMemo(() => {
    let p = 0, k = 0;
    filtered.forEach((t) => {
      const j = Number(t.Jumlah) || 0;
      if (t.Jenis === "Pemasukan") p += j;
      else if (t.Jenis === "Pengeluaran") k += j;
    });
    return { 
      pemasukan: p, 
      pengeluaran: k, 
      saldo: p - k, 
      count: filtered.length 
    };
  }, [filtered]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[30px] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Detail Laporan</DialogTitle>
          <DialogDescription>
            Filter transaksi berdasarkan rentang tanggal.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-left">
              <Label className="text-xs font-bold ml-1 text-muted-foreground uppercase">Dari</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start py-6 rounded-2xl border-gray-100 bg-gray-50 text-black", !from && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {from ? format(from, "dd/MM/yy") : "Mulai"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={from} onSelect={setFrom} initialFocus className="bg-white p-3 rounded-2xl" />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2 text-left">
              <Label className="text-xs font-bold ml-1 text-muted-foreground uppercase">Sampai</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start py-6 rounded-2xl border-gray-100 bg-gray-50 text-black", !to && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {to ? format(to, "dd/MM/yy") : "Selesai"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={to} onSelect={setTo} initialFocus className="bg-white p-3 rounded-2xl" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Result Cards */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-green-50 dark:bg-green-950/20 p-4 border border-green-100 dark:border-green-900">
                <p className="text-[10px] font-bold text-green-600 uppercase">Pemasukan</p>
                <p className="mt-1 text-lg font-black text-green-700 dark:text-green-400">{formatIDR(summary.pemasukan)}</p>
              </div>
              <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 p-4 border border-red-100 dark:border-red-900">
                <p className="text-[10px] font-bold text-red-600 uppercase">Pengeluaran</p>
                <p className="mt-1 text-lg font-black text-red-700 dark:text-red-400">{formatIDR(summary.pengeluaran)}</p>
              </div>
            </div>
            
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 shadow-lg shadow-blue-100 dark:shadow-none">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Sisa Saldo Periode</p>
                <Badge className="bg-white/20 text-white border-none text-[10px]">{summary.count} Tx</Badge>
              </div>
              <p className="text-2xl font-black text-white">{formatIDR(summary.saldo)}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              variant="ghost" 
              className="flex-1 rounded-2xl py-6 text-muted-foreground" 
              onClick={() => { setFrom(undefined); setTo(undefined); }}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button 
              className="flex-1 rounded-2xl py-6 bg-slate-900 text-white font-bold" 
              onClick={() => onOpenChange(false)}
            >
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Badge } from "@/components/ui/badge";