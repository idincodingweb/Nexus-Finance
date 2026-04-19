import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { postAction } from "@/lib/finance-api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type Props = { 
  open: boolean; 
  onOpenChange: (v: boolean) => void; 
  onSuccess?: () => void 
};

export function AddTransactionDialog({ open, onOpenChange, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("nexus_user") || "{}");

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [jenis, setJenis] = useState("Pemasukan");
  const [kategori, setKategori] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [metode, setMetode] = useState("Tunai");
  const [deskripsi, setDeskripsi] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setDate(new Date());
    setJenis("Pemasukan");
    setKategori("");
    setJumlah("");
    setMetode("Tunai");
    setDeskripsi("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !kategori || !jumlah || !user.userId) {
      toast.error("Mohon lengkapi semua field wajib!");
      return;
    }

    setLoading(true);
    try {
      await postAction({
        action: "ADD_TRANSACTION",
        userId: user.userId,
        tanggal: format(date, "yyyy-MM-dd"),
        jenis,
        kategori,
        jumlah: Number(jumlah),
        metode,
        deskripsi,
      });

      toast.success("Transaksi dicatat! 😆");
      queryClient.invalidateQueries({ queryKey: ["finance", user.userId] });
      reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error("Gagal simpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[30px] bg-slate-950 border-slate-800 shadow-2xl overflow-hidden p-0">
        {/* Custom Header with Close Button */}
        <div className="bg-slate-900/50 p-6 border-b border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white text-center">Tambah Transaksi</DialogTitle>
            <DialogDescription className="text-slate-400 text-center">
              Masukkan detail pemasukan atau pengeluaran baru kamu.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400 ml-1 uppercase">Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start py-6 rounded-2xl bg-slate-900 border-slate-800 text-white hover:bg-slate-800",
                      !date && "text-slate-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : "Pilih"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl border-slate-800 bg-white" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="p-3" />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400 ml-1 uppercase">Jenis</Label>
              <Select value={jenis} onValueChange={setJenis}>
                <SelectTrigger className="py-6 rounded-2xl bg-slate-900 border-slate-800 text-white focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="Pemasukan">Pemasukan</SelectItem>
                  <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-400 ml-1 uppercase">Kategori</Label>
            <Input 
              value={kategori} 
              onChange={(e) => setKategori(e.target.value)} 
              placeholder="Misal: Gaji, Makanan..." 
              className="py-6 rounded-2xl bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400 ml-1 uppercase">Jumlah (Rp)</Label>
              <Input
                type="number"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                placeholder="0"
                className="py-6 rounded-2xl bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400 ml-1 uppercase">Metode</Label>
              <Select value={metode} onValueChange={setMetode}>
                <SelectTrigger className="py-6 rounded-2xl bg-slate-900 border-slate-800 text-white focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="Tunai">Tunai</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                  <SelectItem value="E-Wallet">E-Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-400 ml-1 uppercase">Deskripsi (Opsional)</Label>
            <Textarea 
              value={deskripsi} 
              onChange={(e) => setDeskripsi(e.target.value)} 
              placeholder="Catatan tambahan..." 
              className="rounded-2xl bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 min-h-[100px] focus:ring-blue-500"
            />
          </div>

          <DialogFooter className="pt-4 flex gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              className="flex-1 py-7 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-900"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 py-7 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 font-bold text-white shadow-xl shadow-blue-900/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Transaksi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}