import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileDown, TrendingUp, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SummaryCards } from "@/components/finance/SummaryCards";
import { FilterBar } from "@/components/finance/FilterBar";
import { CategoryPieChart } from "@/components/finance/CategoryPieChart";
import { MonthlyBarChart } from "@/components/finance/MonthlyBarChart";
import { fetchFinance, formatIDR } from "@/lib/finance-api";
import { applyFilter, computeSummary, filterLabel, type FilterState } from "@/lib/finance-filter";
import { generatePdfReport } from "@/lib/pdf-report";
import { toast } from "sonner";

const Dashboard = () => {
  // 1. Ambil data user terbaru
  const user = useMemo(() => {
    const saved = localStorage.getItem("nexus_user");
    return saved ? JSON.parse(saved) : null;
  }, []);
  
  const currentUserId = user?.userId || user?.UserID;

  const [filter, setFilter] = useState<FilterState>({ preset: "this_month" });

  const { data, isLoading } = useQuery({ 
    queryKey: ["finance", currentUserId], 
    queryFn: () => fetchFinance(currentUserId),
    enabled: !!currentUserId 
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "Pagi";
    if (hour < 15) return "Siang";
    if (hour < 18) return "Sore";
    return "Malam";
  };

  const filteredRows = useMemo(() => applyFilter(data?.transaksi ?? [], filter), [data, filter]);
  const summary = useMemo(() => computeSummary(filteredRows), [filteredRows]);

  const handlePdf = () => {
    if (filteredRows.length === 0) {
      toast.error("Tidak ada data untuk laporan");
      return;
    }
    try {
      generatePdfReport({ rows: filteredRows, summary, periodLabel: filterLabel(filter) });
      toast.success("Laporan PDF berhasil dibuat");
    } catch {
      toast.error("Gagal membuat laporan");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
             {/* JEBRED! LOGO NF DIGANTI FOTO PROFIL USER */}
             <div className="h-14 w-14 overflow-hidden rounded-[20px] border-2 border-blue-500 shadow-xl bg-white flex items-center justify-center shrink-0">
                {user?.image ? (
                  <img 
                    src={user.image} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback kalau link Drive bermasalah
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${user?.nama || 'User'}&background=2563eb&color=fff&bold=true`;
                    }}
                  />
                ) : (
                  <div className="bg-blue-600 w-full h-full flex items-center justify-center">
                    <UserIcon className="text-white w-7 h-7" />
                  </div>
                )}
             </div>

             <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight md:text-2xl leading-none">
                   Halo Selamat {getGreeting()},
                </h1>
                <span className="text-blue-600 font-black text-2xl md:text-3xl mt-1">
                   {user?.nama || "User"}
                </span>
             </div>
          </div>
          
          <p className="text-sm text-muted-foreground ml-1 inline-flex items-center gap-2 mt-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Ayo pantau arus kas kamu hari ini.
          </p>
          
          {/* Badge Saldo */}
          <div className="mt-4 self-start inline-flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 px-4 py-2 text-xs font-bold text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
            <TrendingUp className="h-4 w-4" />
            Saldo {filterLabel(filter)}: <span className="text-sm">{formatIDR(summary.saldo)}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto space-y-6 px-4">
        <FilterBar filter={filter} onChange={setFilter} />
        <SummaryCards summary={summary} loading={isLoading} />
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MonthlyBarChart rows={data?.transaksi ?? []} />
          <CategoryPieChart rows={filteredRows} />
        </div>
        
        <div className="flex justify-end pt-2">
          <Button onClick={handlePdf} variant="outline" className="rounded-2xl border-blue-200 py-6 px-6 font-bold hover:bg-blue-50 transition-all">
            <FileDown className="mr-2 h-5 w-5 text-blue-500" /> Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;