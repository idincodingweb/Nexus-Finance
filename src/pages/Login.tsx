import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/finance-api";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      if (res.status === "success") {
        localStorage.setItem("nexus_user", JSON.stringify(res.user));
        toast.success(`Selamat datang kembali, ${res.user.nama}! 🔥`);
        navigate("/");
      } else if (res.status === "pending") {
        toast.info("Verifikasi akun dulu, Bro!");
        navigate(`/verify/${res.userId}`);
      } else {
        toast.error(res.message || "Email/Password salah");
      }
    } catch (error) {
      toast.error("Gagal koneksi ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      {/* Background Ornaments */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-8 md:p-12 w-full max-w-md text-center border border-border/50 relative z-10">
        <div className="mx-auto w-20 h-20 overflow-hidden rounded-2xl shadow-xl border-2 border-blue-500 mb-6 bg-white flex items-center justify-center">
          <img src="/logo.png" alt="Nexus Logo" className="w-full h-full object-cover" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Nexus Finance</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 font-medium text-balance">
          Kelola arus kas pribadi dengan cara yang lebih cerdas.
        </p>

        <form onSubmit={handleLogin} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                type="email" 
                placeholder="email@anda.com" 
                className="pl-12 py-7 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
              <button type="button" className="text-[10px] text-blue-600 font-bold hover:underline">Lupa Password?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="pl-12 pr-12 py-7 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button 
            disabled={loading}
            className="w-full py-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all text-lg font-bold shadow-xl shadow-blue-500/20 text-white flex items-center justify-center gap-2 group"
          >
            {loading ? "Menghubungkan..." : "Masuk ke Dashboard"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Belum punya akun? <Link to="/register" className="text-blue-600 font-black hover:underline">Daftar Sekarang &gt;</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;