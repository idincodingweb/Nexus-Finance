import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionsTable } from "@/components/finance/TransactionsTable";
import { AddTransactionDialog } from "@/components/finance/AddTransactionDialog";
import { DetailDialog } from "@/components/finance/DetailDialog";
import { fetchFinance } from "@/lib/finance-api";
import { toast } from "sonner";

const Transactions = () => {
  const queryClient = useQueryClient();
  
  // 1. Ambil data user login (Safety handle userId/UserID)
  const user = useMemo(() => {
    const saved = localStorage.getItem("nexus_user");
    return saved ? JSON.parse(saved) : null;
  }, []);
  
  const currentUserId = user?.userId || user?.UserID;

  const [addOpen, setAddOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  // 2. Ambil data transaksi spesifik user
  const { data, isLoading } = useQuery({ 
    queryKey: ["finance", currentUserId], 
    queryFn: () => fetchFinance(currentUserId),
    enabled: !!currentUserId
  });

  // 3. Fungsi refresh data biar sat-set
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["finance", currentUserId] });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 pt-8 text-left">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none">
            <ListOrdered className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Riwayat Transaksi</h1>
            <p className="text-sm text-muted-foreground font-medium">Pantau setiap pengeluaran & pemasukan kamu.</p>
          </div>
        </div>

        <div className="bg-card rounded-[35px] border shadow-sm p-6 mb-6">
           <div className="flex flex-wrap gap-2 mb-8">
              <Button 
                onClick={() => setAddOpen(true)} 
                className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-6 font-bold shadow-lg shadow-blue-100 dark:shadow-none"
              >
                <Plus className="w-5 h-5 mr-2" /> Tambah Data
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setDetailOpen(true)} 
                className="rounded-2xl border-slate-200 py-6 px-6 font-semibold"
              >
                Detail Laporan
              </Button>
           </div>

           {/* JEBRED! Sekarang pake 'rows' biar data masuk ke tabel */}
           <TransactionsTable 
             rows={data?.transaksi ?? []} 
             loading={isLoading} 
             onChanged={handleRefresh} 
           />
        </div>
      </div>

      <AddTransactionDialog 
        open={addOpen} 
        onOpenChange={setAddOpen}
        onSuccess={handleRefresh}
      />
      
      <DetailDialog 
        open={detailOpen} 
        onOpenChange={setDetailOpen} 
        rows={data?.transaksi ?? []} 
      />
    </div>
  );
};

export default Transactions;