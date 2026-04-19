import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/finance-api";
import { toast } from "sonner";

const Verify = () => {
  const { userId } = useParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.verify(userId!, code);
      if (res.status === "success") {
        toast.success("Verifikasi Berhasil! Ayo login. 😆");
        navigate("/login");
      } else {
        toast.error(res.message || "Kode salah!");
      }
    } catch {
      toast.error("Terjadi masalah sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-8 md:p-12 w-full max-w-md text-center border border-border/50">
        <div className="mx-auto w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <ShieldCheck className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Verifikasi Email</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 font-medium">
          Kami telah mengirimkan 6 digit kode ke email kamu. Sila cek kotak masuk.
        </p>
        
        <form onSubmit={handleVerify} className="space-y-8">
          <Input 
            type="text"
            inputMode="numeric"
            className="text-center text-5xl tracking-[12px] py-12 rounded-[30px] border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 font-black text-blue-600 dark:text-blue-400 focus:ring-4 focus:ring-blue-500/20 transition-all"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          
          <div className="flex flex-col gap-4">
            <Button 
              disabled={loading}
              className="w-full py-8 rounded-2xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-black text-lg shadow-xl transition-all"
            >
              {loading ? "Memverifikasi..." : "Aktivasi Akun"}
            </Button>
            
            <button 
              type="button"
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Kirim Ulang Kode
            </button>
          </div>
        </form>

        <button onClick={() => navigate("/login")} className="mt-10 flex items-center justify-center gap-2 w-full text-xs font-bold text-slate-400">
           <ArrowLeft className="w-4 h-4" /> Kembali ke Login
        </button>
      </div>
    </div>
  );
};

export default Verify;