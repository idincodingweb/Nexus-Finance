import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, UserPlus, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/finance-api";
import { toast } from "sonner";

const Register = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.register(nama, email, password);
      if (res.status === "success") {
        toast.success("Akun dibuat! Cek email buat ambil kode.");
        navigate(`/verify/${res.userId}`);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Gagal mendaftar. Cek koneksi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-10">
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-8 md:p-12 w-full max-w-md text-center border border-border/50">
        <div className="mx-auto w-20 h-20 overflow-hidden rounded-2xl shadow-xl border-2 border-indigo-500 mb-6 bg-white flex items-center justify-center text-indigo-600 uppercase font-black text-2xl">
          <img src="/logo.png" alt="Nexus Logo" className="w-full h-full object-cover" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Buat Akun</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 font-medium">Mulailah mengelola keuangan lebih rapi.</p>

        <form onSubmit={handleRegister} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Nama Anda" 
                className="pl-12 py-7 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-black dark:text-white"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Kerja</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                type="email" 
                placeholder="email@domain.com" 
                className="pl-12 py-7 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-black dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password Baru</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Minimal 6 karakter" 
                className="pl-12 pr-12 py-7 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-black dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button 
            disabled={loading}
            className="w-full py-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-lg font-bold shadow-xl shadow-indigo-500/20 mt-4"
          >
            {loading ? "Menyiapkan Akun..." : "Daftar Gratis Sekarang"}
          </Button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Sudah punya akun? <Link to="/login" className="text-indigo-600 font-black hover:underline">Masuk &gt;</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;